import React, { Component } from "react";
import { Dimensions, Geolocation, Image } from "react-native";
import { Components, Location, Permissions, ImagePicker } from "expo";

const { width, height } = Dimensions.get("window");

class Root extends Component {
  constructor() {
    super();

    this.state = {
      location: null,
      markers: []
    };

    this.getImage = this.getImage.bind(this);
  }

  componentWillMount() {
    this.getLocation();
  }

  componentDidMount() {}

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});

      this.setState({
        location
      });
    }
  };

  getImage = async coordinate => {
    let result = await ImagePicker.launchImageLibraryAsync({});

    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: coordinate,
          image: result.uri
        }
      ]
    });
  };

  componentDidMount() {}

  onPress(e) {
    this.getImage(e.nativeEvent.coordinate);
  }

  render() {
    if (this.state.location == null) {
      return null;
    }

    console.log(this.state);
    const { latitude, longitude } = this.state.location.coords;
    return (
      <Components.MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        onPress={this.onPress.bind(this)}
      >
        <Components.MapView.Marker
          coordinate={this.state.location.coords}
          title="Current Location"
        />
        {this.state.markers &&
          this.state.markers.map((i, k) => {
            console.log(i);
            return (
              <Components.MapView.Marker coordinate={i.coordinate} key={k}>
                <Image
                  source={{ uri: i.image }}
                  style={{
                    width: 24,
                    height: 24
                  }}
                />
              </Components.MapView.Marker>
            );
          })}
      </Components.MapView>
    );
  }
}

export default Root;
