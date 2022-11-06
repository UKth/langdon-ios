import { Class, Course, fullSection } from "@customTypes/models";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { nestedSection } from "src/util";
import ClassInfoBox from "./ClassInfoBox";
import { BoldText } from "./StyledText";

const SectionBox = ({
  section,
  onPress,
  enrolledClasses,
  updateEnrolledClasses,
}: {
  section: nestedSection;
  onPress: (id: number) => void;
  enrolledClasses: (Class & {
    sections: fullSection[];
  } & {
    course: Course;
  })[];
  updateEnrolledClasses: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <View
      style={{
        justifyContent: "center",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
            {
              height: 22,
              alignItems: "center",
              flexDirection: "row",
            },
          ]}
          onPress={() => setShowDetails(!showDetails)}
        >
          <BoldText style={{ marginRight: 5 }}>{section.code}</BoldText>
          <Ionicons
            name="triangle"
            size={14}
            color={"white"}
            style={{
              transform: [{ rotate: showDetails ? "180deg" : "90deg" }],
            }}
          />
        </Pressable>
      </View>
      {showDetails ? (
        Array.isArray(section.value) ? (
          <View style={{ paddingLeft: 20 }}>
            {section.value.map((sect) => (
              <SectionBox
                key={sect.code}
                section={sect}
                onPress={onPress}
                enrolledClasses={enrolledClasses}
                updateEnrolledClasses={updateEnrolledClasses}
              />
            ))}
          </View>
        ) : (
          <View style={{ paddingVertical: 10 }}>
            <ClassInfoBox
              id={section.value.id}
              enrolledClasses={enrolledClasses}
              updateEnrolledClasses={updateEnrolledClasses}
            />
          </View>
        )
      ) : null}
    </View>
  );
};

export default SectionBox;
