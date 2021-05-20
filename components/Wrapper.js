import React from "react";
import { SafeAreaView, View, ScrollView, ImageBackground } from "react-native";

import { icons, images, sizes, colors, fonts } from "../constants";
import { Heading2 } from "./Typography";

export const ScreenView = ({ children, bgColor, horizontal }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={horizontal}
        style={{
          backgroundColor: bgColor || colors.smoke,
        }}
      >
        <View
          style={
            horizontal
              ? {
                  alignContent: "stretch",
                  padding: sizes.base,
                  paddingRight: 100,
                  flexDirection: "row",
                }
              : { padding: sizes.base, paddingBottom: 100 }
          }
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export const NoScrollView = ({ children, bgColor, imgSource }) => {
  return (
    <View style={{ flex: 1 }}>
      {imgSource ? (
        <ImageBackground
          source={imgSource}
          style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            padding: sizes.base * 2,
          }}
        >
          {children}
        </ImageBackground>
      ) : (
        <View
          style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            padding: sizes.base * 2,
            backgroundColor: bgColor || colors.primary,
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export const Card = ({ children, bgColor, title }) => {
  return (
    <View
      style={{
        backgroundColor: bgColor || "white",
        padding: sizes.base,
        paddingBottom: sizes.base * 2,
        borderWidth: 0,
        borderRadius: sizes.base,
        alignItems: "stretch",
        elevation: sizes.base,
        shadowOpacity: 0,
      }}
    >
      {title && (
        <Heading2 style={{ alignSelf: "center", marginBottom: sizes.base }}>
          {title}
        </Heading2>
      )}
      {children}
    </View>
  );
};

export const Row = ({ children, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        ...style,
      }}
    >
      {children}
    </View>
  );
};

export const Space = ({ children, row }) => {
  return (
    <View
      style={{
        flexDirection: row ? "row" : "column",
      }}
    >
      {React.Children.map(children, (c, index) => {
        return index !== children.length - 1
          ? [
              c,
              <View
                style={{
                  width: sizes.base,
                  height: sizes.base,
                }}
              />,
            ]
          : c;
      })}
    </View>
  );
};
