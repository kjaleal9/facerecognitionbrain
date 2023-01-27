import React, { Component, Fragment } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
import Clarifai from "clarifai";

const YOUR_PERSONAL_TOKEN = "59d399823eff418fa02b382f23dbc296";
// const IMAGE_URL =wat

const app = new Clarifai.App({
  apiKey: YOUR_PERSONAL_TOKEN,
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_rol * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({
      box: box,
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.imageURL)
      .then((response) => {
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    console.log(route);
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? (
          <Fragment>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition imageURL={imageURL} box={box} />
          </Fragment>
        ) : route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
