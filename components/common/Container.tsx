import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface ContainerProps extends ViewProps {
    children: React.ReactNode; // Allow child components to be passed
}

const Container: React.FC<ContainerProps> = ({ children, ...rest }) => {
    return (
        <StyledView className="flex w-full bg-gray-950 p-4 mb-4 rounded-lg" {...rest}>
            {children}
        </StyledView>
    );
};

export default Container;
