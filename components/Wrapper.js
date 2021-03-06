import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { icons, images, sizes, colors, fonts } from "../constants";
import { hexToRgba } from "../utils/color";
import { IconManager } from "../utils/image";
import { Button, ImageButton, AutoIcon } from "./Button";
import { Heading1, Heading2, Heading3 } from "./Typography";

const headerHeight = 50;

export const ScreenView = ({
  children,
  bgColor,
  horizontal,
  isMainScreen,
  navigation,
  title,
  style,
  headerColor,
  scrollToTop,
  absoluteChildren,
  popup,
}) => {
  const [showHeader, setShowHeader] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    if (e.nativeEvent.contentOffset.y > headerHeight) {
      setShowHeader(true);
    } else if (e.nativeEvent.contentOffset.y < headerHeight) {
      setShowHeader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor || colors.smoke }}>
      {popup ? (
        <View
          style={{
            zIndex: 2,
            position: "absolute",
            flex: 1,
            alignSelf: "stretch",
            alignContent: "stretch",
            alignItems: "stretch",
          }}
        >
          {popup()}
        </View>
      ) : null}
      {absoluteChildren ? (
        <View
          style={{ zIndex: 2, position: "absolute" }}
          pointerEvents="box-none"
        >
          {absoluteChildren}
        </View>
      ) : null}
      {showHeader && scrollToTop && (
        <View
          pointerEvents="box-none"
          style={{
            zIndex: 2,
            position: "absolute",
            alignSelf: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
            }
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: hexToRgba(colors.primary, 0.9),
              marginRight: sizes.base * 2,
              alignItems: "center",
              justifyContent: "center",
              marginTop: sizes.long - sizes.base * 10,
            }}
          >
            <AutoIcon source={IconManager.upline} height={30} white />
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {(!isMainScreen || showHeader) && (
          <View
            style={{
              backgroundColor: headerColor
                ? hexToRgba(headerColor, 0.95)
                : colors.white98,
              alignSelf: "stretch",
              width: sizes.short,
              justifyContent: "space-between",
              alignItems: "center",
              padding: sizes.base,
              paddingHorizontal: sizes.base * 1.5,
              elevation: headerColor ? 0 : sizes.base * 2,
              position: "absolute",
              zIndex: 2,
              flexDirection: "row",
              height: headerHeight,
            }}
          >
            {!isMainScreen && (
              <ImageButton
                onPress={() => {
                  navigation.goBack();
                }}
                source={IconManager.backline}
                height={sizes.h3}
                color={headerColor ? colors.white : colors.black}
              />
            )}
            <View
              style={{
                position: "absolute",
                width: sizes.short,
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Heading3
                style={{ color: headerColor ? colors.white : colors.black }}
              >
                {title}
              </Heading3>
            </View>
          </View>
        )}
        {isMainScreen && !showHeader && (
          <View
            style={{
              height: headerHeight,
              width: sizes.short,
              backgroundColor: colors.smoke,
              zIndex: 2,
              position: "absolute",
            }}
          />
        )}

        <ScrollView
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={horizontal}
          style={{
            backgroundColor: bgColor || colors.smoke,
          }}
          ref={scrollRef}
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
                : { padding: sizes.base, paddingBottom: 100, ...style }
            }
          >
            <View
              style={{
                marginTop: headerHeight - sizes.base * 1.25,
                alignSelf: "stretch",
                justifyContent: "space-between",
                marginBottom: sizes.base * 1.5,
              }}
            >
              {/* <ImageButton /> */}
              {isMainScreen && <Heading1>{title}</Heading1>}
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const NoScrollView = ({ children, bgColor, imgSource, style }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {imgSource ? (
        <ImageBackground
          source={imgSource}
          style={{
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            padding: sizes.base * 2,
            ...style,
          }}
        >
          {children}
        </ImageBackground>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: sizes.base * 2,
            backgroundColor: bgColor || colors.darkprimary,
            ...style,
          }}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export const Card = ({
  children,
  bgColor,
  title,
  style,
  touchable,
  onPress,
  imgSource,
  height,
  noShadow,
  shadow,
}) => {
  if (!shadow) shadow = 1;
  const containerStyle = {
    backgroundColor: bgColor || "white",
    padding: sizes.base * 2,
    borderWidth: 0,
    borderRadius: sizes.base,
    alignItems: "stretch",
    elevation: noShadow ? 0 : (sizes.base / 4) * shadow,
    shadowOpacity: 0,
    height: height || "auto",
    ...style,
  };
  return touchable ? (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      {title && (
        <Heading2
          style={{
            alignSelf: "center",
            marginBottom: sizes.base * 1.25,
            color: bgColor ? "white" : colors.black,
          }}
        >
          {title}
        </Heading2>
      )}
      {children}
    </TouchableOpacity>
  ) : !imgSource ? (
    <View style={containerStyle}>
      {title && (
        <Heading2
          style={{
            alignSelf: "center",
            marginBottom: sizes.base * 1.25,
            color: bgColor ? "white" : colors.black,
          }}
        >
          {title}
        </Heading2>
      )}
      {children}
    </View>
  ) : (
    <ImageBackground style={containerStyle} source={imgSource}>
      {title && (
        <Heading2
          style={{
            alignSelf: "center",
            marginBottom: sizes.base * 1.25,
            color: bgColor ? "white" : colors.black,
          }}
        >
          {title}
        </Heading2>
      )}
      {children}
    </ImageBackground>
  );
};

export const Row = ({ children, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </View>
  );
};

export const Space = ({ children, loose, tight, center, scale }) => {
  const spaceStyle = loose
    ? {
        width: sizes.base * 2,
        height: sizes.base * 2,
      }
    : tight
    ? {
        width: sizes.base / 2,
        height: sizes.base / 2,
      }
    : scale
    ? {
        width: sizes.base * scale,
        height: sizes.base * scale,
      }
    : {
        width: sizes.base,
        height: sizes.base,
      };
  return React.Children.map(children, (c, index) => {
    return index !== children.length - 1 && children.length > 1
      ? [
          c,
          <View
            style={{ ...spaceStyle, alignItems: center ? "center" : null }}
          />,
        ]
      : c;
  });
};

export const Frame = ({ background, children }) => {
  return (
    <ImageBackground
      style={{
        position: "absolute",
        height: sizes.short,
        width: sizes.long,
        alignItems: "center",
        justifyContent: "center",
      }}
      source={background}
    >
      {children}
    </ImageBackground>
  );
};

export const Impress = ({ color, children }) => {
  if (!color) color = colors.primary;
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 999,
        padding: sizes.base,
        paddingHorizontal: sizes.base * 2,
        borderWidth: 8,
        borderColor: hexToRgba(color, 0.12),
        marginBottom: sizes.base / 2,
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
};

export const RoundImpress = ({ children, size, color }) => {
  if (!size) size = 5;
  if (!color) color = colors.white;
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 999,
        height: sizes.h1 + sizes.base * size,
        width: sizes.h1 + sizes.base * size,
        borderWidth: (sizes.base * 0.75 * size) / 5,
        borderColor: hexToRgba(color, 0.12),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};

export const Round = ({ color, children, size }) => {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 999,
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};

export const ColoredDivider = ({ color }) => {
  return (
    <View
      style={{
        alignSelf: "stretch",
        height: 1,
        backgroundColor: color || colors.fadeblack50,
        marginVertical: sizes.base,
      }}
    />
  );
};
