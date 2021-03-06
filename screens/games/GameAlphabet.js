import React, { useEffect, useRef, useState, useContext } from "react";
import { Alert, ImageBackground, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { ImageButton } from "../../components/Button";
import { colors, sizes } from "../../constants";
import { IconManager, ImageManager, autoSize } from "../../utils/image";
import { playSoundFile } from "../../utils/sound";
import { Hearts } from "../../components/Indicator";
import { Row, Space } from "../../components/Wrapper";

import firestore from "@react-native-firebase/firestore";
import { CollectionName } from "../../utils/enum";
import BackgroundTimer from "react-native-background-timer";
import { UserContext } from "../../App";

const GameAlphabet = ({ route, navigation }) => {
  const { child, gameKey, playedTime, startTime } = route.params;

  const [currentGame, setCurrentGame] = useState();
  const [childGameData, setChildGameData] = useState();

  const user = useContext(UserContext);

  let tempPlayingTime = 0;

  const remainingTime = playedTime
    ? childGameData?.timeLimit - playedTime
    : childGameData?.timeLimit;

  if (remainingTime <= 0 && child?.isLimited) {
    Alert.alert(
      "Thông báo",
      "Bạn không thể chơi do đã vượt quá thời gian giới hạn.",
      [
        {
          text: "Xin thêm thời gian",
          onPress: () => {
            firestore()
              .collection(CollectionName.USERS)
              .doc(user?.uid)
              .collection(CollectionName.CHILDREN)
              .doc(child?._id)
              .update({ moreTime: 0 });
            navigation.goBack();
          },
        },
        { text: "OK", onPress: () => navigation.goBack() },
      ]
    );
  }

  const [question, setQuestion] = useState("Chữ này là chữ gì?");
  const [isAnswered, setIsAnswered] = useState(false);
  const lives = useRef(3);
  const points = useRef(0);

  const lowercaseLetters = [
    "a",
    "aw",
    "aa",
    "b",
    "c",
    "d",
    "dd",
    "e",
    "ee",
    "g",
    "h",
    "i",
    "k",
    "l",
    "m",
    "n",
    "o",
    "oo",
    "ow",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "uw",
    "v",
    "x",
    "y",
  ];
  const uppercaseLetters = lowercaseLetters.map((letter) =>
    letter.toUpperCase()
  );

  const randomLetterIndex = Math.floor(Math.random() * lowercaseLetters.length);
  const [chosenLetterIndex, setChosenLetterIndex] = useState(randomLetterIndex);

  useEffect(() => {
    fetchCurrentGame();
  }, []);

  useEffect(() => {
    fetchChildGameData();
  }, [currentGame]);

  useEffect(() => {
    if (childGameData?.timeLimit && child?.isLimited) {
      if (remainingTime > 0) {
        BackgroundTimer.runBackgroundTimer(() => {
          tempPlayingTime++;
          console.log(tempPlayingTime);
          if (tempPlayingTime == remainingTime) {
            createGameRecord();

            Alert.alert(
              "Thông báo",
              "Bạn không thể chơi do đã vượt quá thời gian giới hạn.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    BackgroundTimer.stopBackgroundTimer();
                    navigation.goBack();
                  },
                },
              ]
            );
          }
        }, 1000);
      }
    }
  }, [childGameData]);

  const createGameRecord = async () => {
    const endTime = new Date().getTime();
    const playedTime = Math.floor((endTime - startTime) / 1000);

    await firestore()
      .collection(CollectionName.GAMES)
      .doc(currentGame?._id)
      .collection(CollectionName.CHILD_GAME_DATA)
      .doc(child?._id)
      .collection(CollectionName.GAME_RECORDS)
      .add({
        playedTime: playedTime,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => console.log("Add game record successfully"))
      .catch((error) => console.log(error));
  };

  const fetchCurrentGame = async () => {
    await firestore()
      .collection(CollectionName.GAMES)
      .where("key", "==", gameKey)
      .get()
      .then((querySnapshot) => {
        const doc = querySnapshot.docs[0];
        const game = { ...doc.data(), _id: doc.id };
        setCurrentGame(game);
      });
  };

  const fetchChildGameData = async () => {
    await firestore()
      .collection(CollectionName.GAMES)
      .doc(currentGame?._id)
      .collection(CollectionName.CHILD_GAME_DATA)
      .doc(child?._id)
      .get()
      .then((doc) => {
        const childData = { ...doc.data(), _id: doc.id };
        setChildGameData(childData);
      });
  };

  // return image on the left
  const getAlphabetImage = (index) => {
    return ImageManager.alphabet[`letter${uppercaseLetters[index]}`];
  };

  // return letters on the right
  const getAlphabet = (index) => {
    return ImageManager.alphabet[`${lowercaseLetters[index]}`];
  };

  const getAnswerIndexes = () => {
    let letters = [chosenLetterIndex];

    while (letters.length < 3) {
      const ranIndex = Math.floor(Math.random() * lowercaseLetters.length);
      if (!letters.includes(ranIndex)) {
        letters.push(ranIndex);
      }
    }

    // shuffle array
    letters = letters.sort(() => Math.random() - 0.5);

    return letters;
  };

  const handleRightAnswer = () => {
    playSoundFile("yayy");
    points.current = points.current + 1;
    setQuestion("Đúng rồi!");
  };

  const handleWrongAnswer = () => {
    if (lives.current <= 1) {
      playSoundFile("ouch");
    } else {
      playSoundFile("lose");
    }
    lives.current = lives.current - 1;

    setQuestion("Sai rồi!");
  };

  const handleChooseAnswer = (answerIndex) => {
    if (answerIndex === chosenLetterIndex) {
      handleRightAnswer();
    } else {
      handleWrongAnswer();
    }
    setIsAnswered(true);
  };

  const AnswerButtons = () => {
    const buttons = [];
    const answerIndexes = getAnswerIndexes();

    answerIndexes.map((index) => {
      const path = getAlphabet(index);
      buttons.push(
        <View
          style={{
            width: "30%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ImageButton
            style={{ marginBottom: 16 }}
            onPress={() => handleChooseAnswer(index)}
            source={path}
          ></ImageButton>
          {/* <Text>{lowercaseLetters[index]}</Text>
          <Text>{uppercaseLetters[index]}</Text> */}
        </View>
      );
    });
    return buttons;
  };

  const AnswerImage = () => {
    const imagePath = getAlphabet(chosenLetterIndex);
    return (
      <Row style={{ marginRight: sizes.base * 3 }}>
        <Space scale={3}>
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: -32 }}
            onPress={() =>
              playSoundFile(`${lowercaseLetters[chosenLetterIndex]}`)
            }
          >
            <Image
              style={{
                resizeMode: "contain",
                // width: 150,
                width: autoSize(
                  getAlphabet(chosenLetterIndex),
                  sizes.long / 3,
                  null
                ).width,
                opacity: 1,
              }}
              source={imagePath}
            />
            {/* <Text>{lowercaseLetters[chosenLetterIndex]}</Text>
        <Text>{uppercaseLetters[chosenLetterIndex]}</Text> */}
          </TouchableOpacity>
          <ImageButton
            source={
              lives.current > 0
                ? IconManager.buttons.orange.play
                : IconManager.buttons.orange.replay
            }
            height={sizes.base * 5}
            onPress={() => resetValue()}
          />
        </Space>
      </Row>
    );
  };

  const AnswerView = () => {
    if (isAnswered) {
      return AnswerImage();
    }
    return AnswerButtons();
  };

  const resetValue = () => {
    const randomLetterIndex = Math.floor(
      Math.random() * lowercaseLetters.length
    );
    if (lives.current <= 0) {
      lives.current = 3;
      points.current = 0;
    }
    setChosenLetterIndex(randomLetterIndex);
    setIsAnswered(false);
    setQuestion("Chữ này là chữ gì?");
  };

  const handleBackBtn = () => {
    // setCurPlayingTime(tempPlayingTime);
    createGameRecord();
    if (child?.isLimited) BackgroundTimer.stopBackgroundTimer();
    navigation.goBack();
  };

  return (
    <ImageBackground
      style={{ backgroundColor: "white", width: "100%", height: "100%" }}
      source={ImageManager.alphabet.grid}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: sizes.base * 2,
        }}
      >
        <View style={{ marginLeft: 16 }}>
          <ImageButton
            source={IconManager.buttons.orange.back}
            onPress={handleBackBtn}
          />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>{question}</Text>
        </View>
        <Hearts
          lives={lives.current}
          points={points.current}
          reverse
          pointColor={colors.black}
          noPadding
        />
      </View>
      <View style={{ flex: 4 }}>
        <View
          style={{
            flexDirection: "row",
            flex: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={getAlphabetImage(chosenLetterIndex)}
              style={{
                ...styles.alphabetImage,
                resizeMode: "contain",
                height: autoSize(
                  getAlphabetImage(chosenLetterIndex),

                  null,
                  sizes.short / 1.5
                ).height,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {AnswerView()}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default GameAlphabet;

const styles = StyleSheet.create({
  imageIcon: {
    width: 45,
    height: 45,
    marginLeft: 16,
  },
  imageButton: {
    width: 45,
    height: 45,
    marginRight: 16,
  },
  text: {
    fontSize: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  alphabetImage: {
    // width: "60%",
    // height: "90%",
    marginTop: -32,
    marginLeft: 16,
  },
  // mediumCountingItem: {
  //   width: 60,
  //   height: 60,
  //   marginLeft: 16,
  // },
  // smallCountingItem: {
  //   width: 45,
  //   height: 45,
  //   marginLeft: 16,
  // },
  // numberButton: {
  //   //width: "50%",
  //   marginBottom: 16,
  // },
});
