from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)


# member api route
@app.route("/members", methods=["POST", "GET"])
def members():
    if request.method == "POST":
        url = "hi guys"
        return redirect(url_for("user", usr="http://127.0.0.1:5000/url"))
    return {"members": ["a", "b", "c"]}


@app.route("/url")
def user():
    return f"<h1>hello</h1>"


if __name__ == "__main__":
    app.run(debug=True)
