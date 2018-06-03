from flask import Flask
app = Flask(__name__ or "App")

@app.route("/")
def hello():
    print "Hello world!"
    return "Hello World over HTTP!!"