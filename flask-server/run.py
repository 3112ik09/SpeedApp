import math
import time
import cv2
from flask import Flask, render_template, Response, request
from flask_cors import CORS, cross_origin
import dlib
import torch

app = Flask(__name__)
sub = cv2.createBackgroundSubtractorMOG2()  # create background subtractor

WIDTH = 1280
HEIGHT = 720

currVideo = 'cars1.mp4'


finalData = {}


def estimateSpeed(location1, location2):
    # d_pixels = math.sqrt(math.pow(location2[0] - location1[0], 2) + math.pow(location2[1] - location1[1], 2))
    # # ppm = location2[2] / carWidht
    # ppm = 8.8
    # d_meters = d_pixels / ppm
    # # print("d_pixels=" + str(d_pixels), "d_meters=" + str(d_meters))
    # a = .8
    # fps = 18
    # speed = d_meters * fps * 2.6 * a
    # return speed
    d_pixels = math.sqrt(math.pow(
        location2[0] - location1[0], 2) + math.pow(location2[1] - location1[1], 2))
    # ppm = location2[2] / carWidht
    ppm = 8.8
    d_meters = d_pixels / ppm
    # print("d_pixels=" + str(d_pixels), "d_meters=" + str(d_meters))
    a = 1
    if location1[1] > 250:
        a = .7
    elif location1[1] > 150:
        a = .8
    elif location1[1] > 100:
        a = .9

    fps = 18
    speed = d_meters * fps * 2.6 * a
    return speed


@app.route('/Form', methods=['GET', 'POST'])
def FormData():
    global currVideo
    if request.method == 'POST':
        image = request.json['Image']
        print(image)
        return "ik"
    return "error"


@app.route('/api', methods=['GET', 'POST'])
def data():
    global currVideo
    if request.method == 'POST':
        url = request.json['url']
        print(url)
        print("post")
        currVideo = url
        return "ok"

    listen_text = str(request.args['query'])
    ll = str(request.args['token'])
    print("token"+ll)
    print(listen_text)
    li = listen_text+"&token="+ll
    print("output")
    print(li)
    if li != "" and li != "&token":

        currVideo = li[0]
    return "ok"


@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')


def gen():
    """Video streaming generator function."""

    model = torch.hub.load('ultralytics/yolov5', 'custom', 'yolov5n.pt')
    model.classes = [2, 3, 5]
    model.conf = 0.40
    cap = cv2.VideoCapture(currVideo)
    imagePath = '/home/ishu/Desktop/yolov5/images'
    rectangleColor = (0, 255, 0)
    frameCounter = 0
    currentCarID = 0
    fps = 0

    carTracker = {}
    carNumbers = {}
    carLocation1 = {}
    carLocation2 = {}
    speed = [None] * 1000

    while True:
        start_time = time.time()
        img = cap.read()[1]
        if img is None:
            break
        result = model(img)
        df = result.pandas().xyxy[0]
        frameCounter = frameCounter + 1
        carIDtoDelete = []
        for carID in carTracker.keys():
            trackingQuality = carTracker[carID].update(img)

            if trackingQuality < 7:
                carIDtoDelete.append(carID)

        for carID in carIDtoDelete:
            print('Removing carID ' + str(carID) + ' from list of trackers.')
            print('Removing carID ' + str(carID) + ' previous location.')
            print('Removing carID ' + str(carID) + ' current location.')
            carTracker.pop(carID, None)
            carLocation1.pop(carID, None)
            carLocation2.pop(carID, None)

        for ind in df.index:
            x1, y1 = int(df['xmin'][ind]), int(df['ymin'][ind])
            x2, y2 = int(df['xmax'][ind]), int(df['ymax'][ind])
            label = df['name'][ind]
            w, h = x2 - x1, y2 - y1
            x_bar = x1 + 0.5 * w
            y_bar = y1 + 0.5 * h

            matchCarID = None

            for carID in carTracker.keys():
                trackedPosition = carTracker[carID].get_position()
                t_x = int(trackedPosition.left())
                t_y = int(trackedPosition.top())
                t_w = int(trackedPosition.width())
                t_h = int(trackedPosition.height())

                t_x_bar = t_x + 0.7 * t_w
                t_y_bar = t_y + 0.7 * t_h

                if ((t_x <= x_bar <= (t_x + t_w)) and (t_y <= y_bar <= (t_y + t_h)) and (x1 <= t_x_bar <= (x1 + w)) and (y1 <= t_y_bar <= (y1 + h))):
                    matchCarID = carID
                    print("matched  -->>>>")

            if matchCarID is None:
                print('Creating new tracker ' + str(currentCarID))
                tracker = dlib.correlation_tracker()
                tracker.start_track(img, dlib.rectangle(x1, y1, x2, y2))
                carTracker[currentCarID] = tracker
                carLocation1[currentCarID] = [x1, y1, w, h]
                currentCarID = currentCarID + 1

        for carID in carTracker.keys():
            trackedPosition = carTracker[carID].get_position()
            t_x = int(trackedPosition.left())
            t_y = int(trackedPosition.top())
            t_w = int(trackedPosition.width())
            t_h = int(trackedPosition.height())

            # cv2.rectangle(img, (t_x, t_y), (t_x + t_w, t_y + t_h), rectangleColor, 2)

            # speed estimation
            carLocation2[carID] = [t_x, t_y, t_w, t_h]

        end_time = time.time()

        if not (end_time == start_time):
            fps = 1.0 / (end_time - start_time)

        for i in carLocation1.keys():
            if frameCounter % 1 == 0:
                [x1, y1, w1, h1] = carLocation1[i]
                [x2, y2, w2, h2] = carLocation2[i]

                # print 'previous location: ' + str(carLocation1[i]) + ', current location: ' + str(carLocation2[i])
                carLocation1[i] = [x2, y2, w2, h2]
                cv2.putText(img, "Speed Detection Zone", (20, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
                cv2.line(img, (0, 70), (1500, 70), (0, 0, 255), 2)
                cv2.line(img, (0, 500), (1500, 500), (0, 0, 255), 2)
                # print 'new previous location: ' + str(carLocation1[i])
                if [x1, y1, w1, h1] != [x2, y2, w2, h2]:

                    if (speed[i] == None or speed[i] == 0):
                        speed[i] = estimateSpeed(
                            [x1, y1, w1, h1], [x2, y2, w2, h2])

                    # if y1 > 275 and y1 < 285:
                    if speed[i] != None and y1 > 60 and y1 < 270:
                        # print("---  -----  Speed ---- ", speed[i], " ", i)
                        # print(" the y axis ", y1)
                        if finalData.get(i) == None:
                            t = []
                            t.append(i)
                            t.append(speed[i])
                            t.append(label)
                            finalData[i] = t
                            new_img = img[y2:y2 + h1, x2:x2 + w1]
                            # cv2.imwrite(str(i) + '.jpg', new_img)
                        else:
                            k = finalData.get(i)[1] = (
                                finalData.get(i)[1] + speed[i]) // 2
                            #print("k  == ", k)

                        cv2.rectangle(
                            img, (x2, y2), (x2 + w1, y2 + h1), rectangleColor, 2)

                        cv2.putText(img, str(int(speed[i])) + " km/hr", (int(x1 + w1 / 2),
                                    int(y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

                        # print ('CarID ' + str(i) + ': speed is ' + str("%.2f" % round(speed[i], 0)) + ' km/h.\n')

                        # else:
                        #	cv2.putText(resultImage, "Far Object", (int(x1 + w1/2), int(y1)),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                        # print ('CarID ' + str(i) + ' Location1: ' + str(carLocation1[i]) + ' Location2: ' + str(carLocation2[i]) + ' speed is ' + str("%.2f" % round(speed[i], 0)) + ' km/h.\n')
        # cv2.imshow('result', img)
        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        # time.sleep(0.1)
        key = cv2.waitKey(20)
        if key == 27:
            break


# def gen(vid):
#     """Video streaming generator function."""
#     cap = cv2.VideoCapture(vid)

#     # Read until video is completed
#     while(cap.isOpened()):
#         ret, frame = cap.read()  # import image
#         if not ret:  # if vid finish repeat
#             frame = cv2.VideoCapture("cars1.mp4")
#             continue
#         if ret:  # if there is a frame continue with code
#             image = cv2.resize(frame, (0, 0), None, 1, 1)  # resize image
#             # converts image to gray
#             gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#             fgmask = sub.apply(gray)  # uses the background subtraction
#             # kernel to apply to the morphology
#             kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
#             closing = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, kernel)
#             opening = cv2.morphologyEx(closing, cv2.MORPH_OPEN, kernel)
#             dilation = cv2.dilate(opening, kernel)
#             retvalbin, bins = cv2.threshold(
#                 dilation, 220, 255, cv2.THRESH_BINARY)  # removes the shadows
#             contours, hierarchy = cv2.findContours(
#                 dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#             minarea = 400
#             maxarea = 50000
#             for i in range(len(contours)):  # cycles through all contours in current frame
#                 # using hierarchy to only count parent contours (contours not within others)
#                 if hierarchy[0, i, 3] == -1:
#                     area = cv2.contourArea(contours[i])  # area of contour
#                     if minarea < area < maxarea:  # area threshold for contour
#                         # calculating centroids of contours
#                         cnt = contours[i]
#                         M = cv2.moments(cnt)
#                         cx = int(M['m10'] / M['m00'])
#                         cy = int(M['m01'] / M['m00'])
#                         # gets bounding points of contour to create rectangle
#                         # x,y is top left corner and w,h is width and height
#                         x, y, w, h = cv2.boundingRect(cnt)
#                         # creates a rectangle around contour
#                         cv2.rectangle(
#                             image, (x, y), (x + w, y + h), (0, 255, 0), 2)
#                         # Prints centroid text in order to double check later on
#                         cv2.putText(image, str(cx) + "," + str(cy), (cx + 10,
#                                     cy + 10), cv2.FONT_HERSHEY_SIMPLEX, .3, (0, 0, 255), 1)
#                         cv2.drawMarker(image, (cx, cy), (0, 255, 255), cv2.MARKER_CROSS,
#                                        markerSize=8, thickness=3, line_type=cv2.LINE_8)
#         #cv2.imshow("countours", image)
#         frame = cv2.imencode('.jpg', image)[1].tobytes()
#         yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
#         # time.sleep(0.1)
#         key = cv2.waitKey(20)
#         if key == 27:
#             break


@app.route('/video_feed')
def video_feed(vid="cars1.mp4"):
    """Video streaming route. Put this in the src attribute of an img tag."""
    currVideo = vid
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(debug=True)
