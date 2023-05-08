import os

folder_path = "/home/ishant/Desktop/YOLOv8-DeepSORT-Object-Tracking/runs/detect"
file_name = "cars7.mp4"


for root, dirs, files in os.walk(folder_path):
   
    if file_name in files:
      
        file_path = os.path.join(root, file_name)
        print("File found at:", file_path)
        break  
else:
    
    print("File not found in folder and its subdirectories.")