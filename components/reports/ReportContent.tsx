// src/components/ReportContent.tsx

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
//import {styled} from "nativewind";

// const Text = styled(Text);
// const View = styled(View);

interface ReportContentProps {
    reportContent: string;
}

const ReportContent: React.FC<ReportContentProps> = ({ reportContent }) => {
    // Split the report content by newlines for line-by-line rendering
    const reportLines = reportContent.split('\n');

    return (
        <View className="flex-1 px-2">
            <ScrollView style={{ paddingVertical: 10 }}>
                {reportLines.map((line, index) => (
                    <Text key={index} className="text-primary">
                        {line}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
};

export default ReportContent;
