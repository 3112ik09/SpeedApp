import math
import time
import cv2
from flask import Flask, render_template, Response, request , jsonify
from flask_cors import CORS, cross_origin
import dlib
import torch
import os
import cv2
import numpy as np
import pytesseract
import urllib.request
import requests
import xmltodict 
import json



faceCascade = cv2.CascadeClassifier('haarcascades/haarcascade_russian_plate_number.xml')

folder_path = "/home/ishant/Desktop/YOLOv8-DeepSORT-Object-Tracking/runs/detect"

userName = "Psycho_ik"

app = Flask(__name__)
sub = cv2.createBackgroundSubtractorMOG2()  # create background subtractor

WIDTH = 1280
HEIGHT = 720

currVideo = '/home/ishant/Desktop/YOLOv8-DeepSORT-Object-Tracking/runs/detect/train37/cars7.mp4'


finalData = {}

# to the find the number plate text 

def numberPlate(url):

    urllib.request.urlretrieve(url, 'image.jpg')
    img = cv2.imread('image.jpg')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale(gray,scaleFactor=1.2,
        minNeighbors = 5, minSize=(25,25))

    for (x,y,w,h) in faces:
        cv2.rectangle(gray,(x,y),(x+w,y+h),(255,0,0),2)
        plate = gray[y: y+h, x:x+w]

        # put the blurred plate into the original image
        # cv2.imshow('plates11',plate)

        thresh = cv2.threshold(plate, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
        predicted_result = pytesseract.image_to_string(plate, lang ='eng',
        config ='--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        
        filter_predicted_result = "".join(predicted_result.split()).replace(":", "").replace("-", "")

        # Print the recognized text
        print("text is " , filter_predicted_result)
        return filter_predicted_result


def get_vehicle_info(plate_number):

    # r = requests.get(
    #     "http://www.regcheck.org.uk/api/reg.asmx/CheckIndia?RegistrationNumber={0}&username={1}".format(str(plate_number) , userName))
    # data = xmltodict.parse(r.content)
    # jdata = json.dumps(data)
    # df = json.loads(jdata)

    vehicle_data = { "Description": "HYUNDAI MOTOR INDIA LTD / CRETA 1.6 VTVT E", "RegistrationYear": "2018", "CarMake": { "CurrentTextValue": "HYUNDAI MOTOR INDIA LTD" }, "CarModel": { "CurrentTextValue": "CRETA 1.6 VTVT E" }, "MakeDescription": { "CurrentTextValue": "HYUNDAI MOTOR INDIA LTD" }, "ModelDescription": { "CurrentTextValue": "CRETA 1.6 VTVT E" }, "VechileIdentificationNumber": "MALC181CLJM30000", "EngineNumber": "G4FGHW6XXXXX", "FuelType": { "CurrentTextValue": "PETROL" }, "RegistrationDate": "28/01/2018", "Owner": "HANNAH ISAAC", "Fitness": "27-Jan-2033", "Insurance": "27-Jan-2019", "Location": "DY.DIR.ZONAL OFFICE,EAST DELHI,MAYUR VIHAR", "ImageUrl": "http://in.carregistrationapi.com/image.aspx/@SFlVTkRBSSBNT1RPUiBJTkRJQSBMVEQgLyBDUkVUQSAxLjYgVlRWVCBF" }
    return jsonify(vehicle_data)
    # return jsonify(df)



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
    if request.method == 'POST':
        url = request.json['url']
        try:
            no = numberPlate(url)
            print(no)
            if no:
                vehicle_data = get_vehicle_info(no)
                print(vehicle_data)
                return vehicle_data
            else:
                return jsonify({'error': 'No number plate found in image'})
        except Exception as e:
            print("jj errror")
            return jsonify({'error': str(e)})
    return jsonify({'error': 'Invalid request method'})
  
        
    return "error"


@app.route('/api', methods=['GET', 'POST'])
def data():
    global currVideo
    if request.method == 'POST':
        url = request.json['url']
        file_name = request.json['name']
        for root, dirs, files in os.walk(folder_path):
   
            if file_name in files:
                file_path = os.path.join(root, file_name)
                currVideo = file_path
                break  
        else:
            print("File not found in folder and its subdirectories.")
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

    # model = torch.hub.load('ultralytics/yolov5', 'custom', 'yolov5n.pt')
    # model.classes = [2, 3, 5]
    # model.conf = 0.40
    cap = cv2.VideoCapture(currVideo)
    # imagePath = '/home/ishu/Desktop/yolov5/images'
    # rectangleColor = (0, 255, 0)
    # frameCounter = 0
    # currentCarID = 0
    # fps = 0

    # carTracker = {}
    # carNumbers = {}
    # carLocation1 = {}
    # carLocation2 = {}
    # speed = [None] * 1000

    while True:
        start_time = time.time()
        img = cap.read()[1]
        if img is None:
            break
        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        # time.sleep(0.1)
        key = cv2.waitKey(20)
        if key == 27:
            break



@app.route('/video_feed')
def video_feed(vid="cars1.mp4"):
    """Video streaming route. Put this in the src attribute of an img tag."""
    currVideo = vid
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(debug=True)
