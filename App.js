import { StyleSheet, Text, View, ImageBackground, Modal, Platform, StatusBar} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReusableSelectDropdown from './ReusableSelectDropdown.js';
let initialSettings = ["subject", "lighting", "speed", "distance"];
// Dictionary of shooting enviornments and respective iso, shutter, and aperature values 
const dict = {
  Fast: 400, Slow: 200,
  Stationary: 160, Sunny: 100,
  Cloudy: 200, Shady: 200,
  Dark: 700, Bright: 100,
  Lowlighting: 500, Nighttime: 1600,
  Person: 2, Landscape: 6,
  Object: 3, Far: 6, 
  Midway: 4, Close: 3,
  Sunrise: 200, Sunset:200,
  Indoor:800, Building:3,
  Event:3, Animal: 3, Portrait: 1,
  Floodlight: 400
};
// Dictionary of shooting enviornments and respective iso, shutter, and aperature values for those shooting during night or with a tripod
const night = {
  Fast: 300, Slow: 200,
  Stationary: 100, Sunny: 100,
  Cloudy: 200, Shady: 200,
  Dark: 10, Bright: 100,
  Lowlighting: 20, Nighttime: 2,
  Person: 2, Landscape: 4,
  Object: 2, Far: 4, 
  Midway: 3, Close: 2,
  Sunrise: 30, Sunset:20,
  Indoor:50, Building:3,
   Fireworks: 4, Floodlight: 20,
  Event: 2, Animal: 2, Portrait: 1,
};

// Dictionary of exposure values and their respective descriptions 
const exposureValueInfo = {
  "-7": "a deep star field or the Milky Way                                         ",
  "-6": "a night under starlight only or the Aurora Borealis                        ",
  "-5": "a night under crescent moon or the Aurora Borealis                         ",
  "-4": "a night under half moon, or a meteor shower                                ",
  "-3": "a night under full moon and away from city lights                          ",
  "-2": "a night snowscape under full moon and away from city lights                ",
  "-1": "a sunrise or sunset of the 'blue hour' or dim ambient lighting             ",
  "0": "a dim ambient artificial lighting indoors or outdoors                       ",
  "1": "a distant view of a lit skyline, under the moonlight                        ",
  "2": "under lightning or a total lunar eclipse                                    ",
  "3": "fireworks , Christmas lights, and lightning                                 ",
  "4": "christmas lights, floodlit buildings, fountains, or bright street lamps     ",
  "5": "home interiors at night, fairs and amusement parks                          ",
  "6": "brightly lit home interiors at night, fairs and amusement parks             ",
  "7": "brightly-lit nighttime streets and floodlit indoor sports areas or stadiums ",
  "8": "campfires, ice shows; Floodlit indoor sports areas or stadiums              ",
  "9": "landscapes, city skylines 10 minutes after sunset, neon lights              ",
  "10": "landscapes and skylines immediately after sunset, capturing a crescent moon",
  "11": "sunsets subject to deep shade or daylight on a foggy day                   ",
  "12": "moments before a sunset on a clear day, and capturing half moon            ",
  "13": "Typical subject on a bright, cloudy day, and capturing gibbous moon        ",
  "14": "subjects on a day with hazy sunlight                                       ",
  "15": "a bright or hazy sun, clear sky, with shadows                              ",
  "16": "a bright daylight on sand or snow                                          ",
  "17": "a very bright artificial lighting, a bright day                            ",
  "18": "a very bright artificial lighting, a bright day                            ",
  "19": "a very bright artificial lighting, a bright day                            ",
  "20": "an xtremely bright artificial lighting, telescopic view of the sun         "
};
// Parent component
export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [iso, setIso] = useState(0);
  const [userMode, setUserMode] = useState("")
  const [shutter, setShutter] = useState(0);
  const [aperature, setAperature] = useState(0);
  const [userInputs, setUserInputs] = useState(initialSettings);
  const [clicked, setClicked] = useState(false);

  let speed = ["Fast", "Slow", "Stationary"];
  let lighting = ["Sunny", "Cloudy", "Shady", "Dark", "Bright", "Lowlighting", "Nighttime", "Floodlight", "Indoor",];
  let subject = ["Portrait", "Person", "Landscape", "Object", "Stars", "Sunset", "Sunrise", "Building", "Event", "Animal", "Fireworks"];
  let distance = ["Far","Midway", "Close"];
  let mode = ["Tripod", "Handheld"];
  // Controls modal visibility, and resets the user inputs when the user exits or enters the modal
  function startSettingsHandler() {
    setModalIsVisible(!modalIsVisible);
    setClicked(false);
    setUserInputs(initialSettings);
  }
  // Updates user input when an item is chosen in a dropdown
  function inputHandler(selectedItem, index) {
    if (selectedItem == "Tripod" || selectedItem == "Handheld") {
      setUserMode(selectedItem);
    }
    else {
      const updatedInputs = [...userInputs];
      updatedInputs[index] = selectedItem;
      setUserInputs(updatedInputs);
    }
    setClicked(false);
  }
  // Determines exposure value given iso, shutter, and aperature
  function exposureValue(iso, shutter, ap) {
    let value = 0;
    if (userInputs[0]=="Fireworks" || userInputs[0]=="Stars") {
      value = Math.round(Math.log2((100*Math.pow(ap,2))/(iso*(shutter))));
    }
    else {
      value = Math.round(Math.log2((100*Math.pow(ap,2))/(iso*(1/shutter))));
    }
    if (isNaN(value) || !clicked) {
      return <Text>This is where your exposure value will be {'\n'} </Text>
    }
    else{
      return <Text>EV~{value} is perfect for {exposureValueInfo[value.toString()]}</Text>
    }
  }
  // Helper function that sets iso, shutter, and aperature if user inputs 'Stars'
  function setValuesForStars() {
    setIso(2000);
    setShutter(30);
    setAperature(3.5);
  }
  // Helper function that sets iso, shutter, and aperature if user inputs 'Fireworks'
  function setValuesForFireworks() {
    setIso(300);
    setShutter(4);
    setAperature(11);
  }
  // Helper function that sets and calculates iso, shutter, and aperature if user inputs 'Sunrise' or 'Sunset'
  function setValuesForSunsetOrSunrise(selectedLighting, selectedSpeed, selectedDistance, selectedSubject) {
    if (userMode == "Tripod") {
      let newIso = night[selectedSpeed];
      const newShutter = night[selectedSubject];
      const newAperature = night[selectedDistance] + 4;
      if (selectedLighting== "Lowlighting" || selectedLighting== "Dark") {
        newIso = newIso +100;
      }
      else if (selectedLighting== "Nighttime" || selectedLighting== "Shady") {
        newIso = newIso + 200;
      }
      setIso(newIso);
      setShutter(newShutter);
      setAperature(newAperature);
    }
    else {
      let newIso = (dict[selectedLighting] + dict[selectedSubject])/2;
      if (selectedLighting == "Sunny" || selectedLighting == "Bright" || selectedLighting == "Lowlighting") {
        newIso = newIso - 50;
      }

      // Shutter speed based on selected speed
      const newShutter = dict[selectedSpeed]/2;
    
      // Aperture based on distance
      const newAperature = 1 + dict[selectedDistance];
      setIso(newIso);
      setShutter(newShutter);
      setAperature(newAperature);
    }
  }
  // Helper function that sets and calculates iso, shutter, and aperature
  function setValuesForOtherSubjects(selectedLighting, selectedSpeed, selectedDistance, selectedSubject) {
    if (userMode == "Tripod") {
      const newIso = night[selectedSpeed];
      const newShutter = night[selectedLighting];
      const newAperature = night[selectedDistance] + night[selectedSubject];
      setIso(newIso);
      setShutter(newShutter);
      setAperature(newAperature);
    }
    else {
      const newIso = dict[selectedLighting];
      const newShutter = dict[selectedSpeed];
      const newAperature = dict[selectedDistance] + dict[selectedSubject];
      setIso(newIso);
      setShutter(newShutter);
      setAperature(newAperature);
    }
  }
  // Handles user inputs and calls respective child function.
  function settingsHandler() {
    if (userInputs[0] == "subject" || userInputs[1] == "lighting" || userInputs[2] == "speed" || userInputs[3] == "distance") {
      setClicked(false);
      return;
    }
    else {
      setClicked(true);
    }
    const selectedSubject = userInputs[0];
    const selectedLighting = userInputs[1];
    const selectedSpeed = userInputs[2];
    const selectedDistance = userInputs[3];

  
    if (selectedSubject === "Stars") {
      setValuesForStars();
    } else if (selectedSubject === "Fireworks") {
      setValuesForFireworks();
    } else if (selectedSubject === "Sunset" || selectedSubject === "Sunrise") {
      setValuesForSunsetOrSunrise(selectedLighting, selectedSpeed, selectedDistance, selectedSubject);
    } else {
      setValuesForOtherSubjects(selectedLighting, selectedSpeed, selectedDistance, selectedSubject);
    }
  }
  // Determines what text to render for camera settings based on user input and whether or not the calculate button has been clicked
  function renderText() {
    if ((userInputs[0]== "Stars" || userInputs[0] == "Fireworks" || (userInputs[1] == "Nighttime" && userMode== "Tripod")) && clicked == true) {
      return <Text>ISO: {iso} SHUTTER: {shutter} APERATURE: {aperature}</Text>;
    } else if (!clicked || (iso == null || shutter == null || aperature == null || isNaN(iso) || isNaN(shutter) || isNaN(aperature) )) {
      return <Text>This is where your settings will be</Text>;
    } else {
      return <Text>ISO: {iso} SHUTTER: 1/{shutter} APERATURE: {aperature}</Text>;
    }
  }
  // Helper function for dropdown component
  const dropdownConfig = (string, data, index) => {
    return {
      data,
      onSelect: (selectedItem) => inputHandler(selectedItem, index),
      buttonTextAfterSelection: (selectedItem, index) => selectedItem,
      rowTextForSelection: (item, index) => item,
      defaultButtonText: `Select ${string}`
    };
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/otherPage.jpg')} style={styles.image} resizeMode=
        'cover'> 
        <ImageBackground source={require('./assets/homePage.jpg')} style={styles.image} resizeMode=
        'cover'>
          <Text style = {styles.homeHeader}>
              CameraBuddy 
          </Text>
          <Text style = {styles.homeText}>
            photography made easy, {'\n'} settings tailored to your vision
          </Text>
          <Ripple style={styles.homePageButton} onPress={startSettingsHandler} rippleColor='white'>
            <FontAwesome name = "arrow-right" color={'#FFF'} size={18} bounce/>
          </Ripple>
          <Text style = {styles.welcomeText}>
            to get started, {'\n'} press the lense!
          </Text>
        </ImageBackground>
      <Modal backdropTransitionOutTiming={0} animationType={'fade'} transparent={true} hideModalContentWhileAnimating visible={modalIsVisible} >
        <ImageBackground source={require('./assets/otherPage.jpg')} style={styles.image} resizeMode=
          'cover'> 
          <Text style = {styles.header}>
              CameraBuddy 
          </Text>
          <Text style = {styles.infoText}>
            simply enter your shooting enviornment below {'\n'}and calculate!
          </Text>
        <View style={styles.dropdowns}>
          <View style={styles.dropdownRows}>
            <ReusableSelectDropdown 
            {...dropdownConfig('mode',mode, 0)}
            />
          </View>
          <View style={styles.dropdownRows}>
            <ReusableSelectDropdown 
            {...dropdownConfig('subject',subject, 0)}
            />
            <ReusableSelectDropdown 
            {...dropdownConfig('lighting',lighting, 1)}
            />
          </View>
          <View style={styles.dropdownRows}>
            <ReusableSelectDropdown 
            {...dropdownConfig('speed',speed, 2)}
            />
            <ReusableSelectDropdown 
              {...dropdownConfig('distance',distance, 3)}
            />
          </View>
        </View>
          <Ripple style={styles.calculateButton} onPress={settingsHandler} rippleColor='white'>
            <Text style = {styles.calculateText}>Calculate</Text>
          </Ripple>
          <Text style={styles.renderedTextStyle}>{renderText()}</Text>
          <Text style={styles.renderedTextStyle} >{exposureValue(iso, shutter, aperature)}</Text>
          <Ripple style={styles.goBackButton} onPress={startSettingsHandler}  rippleColor='white'>
            <FontAwesome name = "arrow-left" color={'#FFF'} size={18}/>
          </Ripple>
        </ImageBackground>
      </Modal>
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? 90 : 41,
  },
  homePageButton: {
    width: 53,
    height: 53,
    backgroundColor: '#c3d4d2',
    borderWidth: 1,
    borderRadius: 200,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: "black",
    marginLeft: Platform.OS === 'ios' ? 71 : 64,
    marginBottom: Platform.OS === 'ios' ? 120 : 100,
    marginTop: 20
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 10,
  },
  homeText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom:310
  },
  calculateText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  renderedTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    borderColor: 'black',
    marginTop: Platform.OS === 'ios' ? 20 : 10
  },
  dropdowns: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? 70 : 80,
  },
  dropdownRows: {
    flexDirection:'row',
    gap: 10
  },
  header: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    flexDirection: 'column',
    marginBottom: Platform.OS === 'ios' ? 82 : 45,
    marginTop: Platform.OS === 'ios' ? 87 : 75.5,
  },
  calculateButton: {
    width: 150,
    height: 52,
    backgroundColor: '#c3d4d2',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 200,
    marginBottom: 10

  },
  image: {
    flex:1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  goBackButton: {
    width: 70,
    height: 72,
    backgroundColor: '#c3d4d2',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    marginBottom: Platform.OS === 'ios' ? 50 : 65,
    marginTop:Platform.OS === 'ios' ? 10 : 0,
  },
});


