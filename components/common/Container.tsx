import React from 'react';
import { View, ViewProps } from 'react-native';
//import { styled } from 'nativewind';
import {Colors} from "@/constants/Colors";

// const View = styled(View);

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, ...rest }) => {
    return (
        <View className={`flex w-full p-4 mb-4 rounded-lg bg-medium`} {...rest}>
            {children}
        </View>
    );
};

export default Container;
