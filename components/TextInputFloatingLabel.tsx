import React, { useRef, useState, useEffect } from 'react';
import { Animated, TextInput, TextInputProps, View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledAnimatedText = styled(Animated.Text);

export const ThemedTextInputTypes = {
    default: 'default',
    password: 'password',
    multi: 'multi'
};

interface TextInputFloatingLabelProps extends TextInputProps {
    label: string;
    errorMessage?: string;
    hasError?: boolean;
    showError?: boolean;
}

const TextInputFloatingLabel: React.FC<TextInputFloatingLabelProps> = ({
                                                                           label,
                                                                           value = '',
                                                                           errorMessage,
                                                                           hasError = false,
                                                                           showError = true,
                                                                           onFocus,
                                                                           onBlur,
                                                                           ...textInputProps
                                                                       }) => {

    const borderColor = hasError ? 'border-red-500' : 'border-gray-600';

    const floatingLabelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [fontWeight, setFontWeight] = useState<'bold' | 'normal'>('normal'); // Simple fontWeight state
    const [isFocused, setIsFocused] = useState(false); // Track if the field is focused

    const triggerLabelAnimation = (toValue: number) => {
        Animated.timing(floatingLabelAnimation, {
            toValue,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const handleFocus = (e: any) => {
        setFontWeight('bold'); // Set font weight to bold on focus
        setIsFocused(true); // Mark the field as focused
        triggerLabelAnimation(1);
        if (onFocus) {
            onFocus(e);
        }
    };

    const handleBlur = (e: any) => {
        setIsFocused(false); // Mark the field as not focused
        if (!value) {
            setFontWeight('normal'); // Reset font weight to normal on blur if no value
            triggerLabelAnimation(0);
        }
        if (onBlur) {
            onBlur(e);
        }
    };

    // Trigger animation based on the value changes (for programmatically set values)
    useEffect(() => {
        if (value || isFocused) {
            triggerLabelAnimation(1);
            setFontWeight('bold');
        } else {
            triggerLabelAnimation(0);
            setFontWeight('normal');
        }
    }, [value, isFocused]);

    // Define animated styles for the floating label position and size
    const floatingLabelStyle = {
        top: floatingLabelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [10, -5], // top value
        }),
        fontSize: floatingLabelAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12], // font size
        }),
        fontWeight // This is handled here
    };

    return (
        <StyledView className="mt-2 mx-2">
            <StyledAnimatedText
                style={floatingLabelStyle} // Consolidate the styles here
                className={'absolute text-gray-400'}
            >
                {label}
            </StyledAnimatedText>
            <StyledTextInput
                className={`pt-3 pb-1 px-2 border-b ${borderColor} text-lg text-white`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                {...textInputProps}
            />
            {showError && hasError && <StyledText className='text-red-500'>{errorMessage}</StyledText>}
        </StyledView>
    );
};

export default TextInputFloatingLabel;
