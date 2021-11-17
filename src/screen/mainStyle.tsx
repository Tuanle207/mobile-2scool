import { StyleSheet } from "react-native";
import { color } from "../assets/color";
import { fontSize, height } from "../assets/size";

export const mainStyle = StyleSheet.create({
    buttonTitle: {
        color: 'white',
        fontSize: fontSize.content,
        fontWeight: 'bold',
    },
    buttonContainer: {
        height: height.button,
        backgroundColor: color.blueStrong,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 30,
    },
})