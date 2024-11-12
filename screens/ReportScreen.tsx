import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import {styled} from "nativewind";
import ThemedScreen from "@/components/common/ThemedScreen";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEntriesContext } from '@/context/EntriesContext';
import { useChoresContext } from '@/context/ChoresContext';
import dayjs from "@/utils/dayjsConfig";
import { Colors } from '@/constants/Colors';
import {getChoreNameById} from "@/utils/helpers";
import ReportContent from '@/components/reports/ReportContent';
import ReportExportTypeModal from "@/components/modals/ReportExportTypeModal";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ReportScreen = () => {

    const { entries } = useEntriesContext();
    const { chores } = useChoresContext();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [reportContent, setReportContent] = useState<string>('');
    // State for date pickers
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const [isExportModalVisible, setExportModalVisible] = useState(false);

    const generateReport = () => {
        if (!startDate || !endDate) {
            Alert.alert("Please select a start and end date for the report.");
            return;
        }

        // Ensure startDate is before or equal to endDate
        if (dayjs(startDate).isAfter(endDate)) {
            Alert.alert("Start date cannot be after the end date.");
            return;
        }

        const filteredEntries = entries.filter((entry) =>
            dayjs(entry.dateCompleted).isBetween(startDate, endDate, 'day', '[]')
        );

        const reportData = filteredEntries.reduce((report: Record<string, string[]>, entry) => {
            const dateKey = dayjs(entry.dateCompleted).format('YYYY-MM-DD');
            if (!report[dateKey]) {
                report[dateKey] = [];
            }
            const name = getChoreNameById(chores, entry.choreId) || "Chore Not Found";
            report[dateKey].push(name);
            //console.log(report);
            return report;
        }, {});

        // Sort dates in ascending order
        const sortedDates = Object.keys(reportData).sort((a, b) => dayjs(a).diff(dayjs(b)));

        // Create a content string that will contain report info
        let content : string;

        // Set content title depending on if its a single date or a date range
        if (dayjs(startDate).isSame(endDate, 'day')) {
            content = `Report for ${dayjs(startDate).format('ddd MMM D, YYYY')}\n\n`;
        } else {
            content = `Report from ${dayjs(startDate).format('ddd MMM D, YYYY')} to ${dayjs(endDate).format('ddd MMM D, YYYY')}\n\n`;
        }

        // Add each date to the content string
        sortedDates.forEach((date) => {
            content += `Date: ${dayjs(date).format('ddd MMM D, YYYY')}\n`;
            reportData[date].forEach((choreName) => {
                content += `  - ${choreName}\n`;
            });
            content += '\n';
        });

        setReportContent(content);
    };

    const exportReportAsFile = async () => {
        if (!reportContent) {
            Alert.alert("Please generate the report first.");
            return;
        }

        const fileUri = `${FileSystem.documentDirectory}Chore_Report_${dayjs().format('YYYY-MM-DD')}.txt`;
        await FileSystem.writeAsStringAsync(fileUri, reportContent);

        // Share the report
        await Sharing.shareAsync(fileUri);
    };

    const sendReportAsEmail = async () => {
        if (!reportContent) {
            Alert.alert("Please generate the report first.");
            return;
        }

        try {
            const result = await MailComposer.composeAsync({
                recipients: [], // Add recipient email addresses here
                subject: `Chore Report - ${dayjs().format('MMM D, YYYY')}`,
                body: reportContent,
            });

            // Unsure if I want an Alert here since the SENT status occurs when the email modal is closed
            // if (result.status === MailComposer.MailComposerStatus.SENT) {
            //     Alert.alert("Report sent successfully!");
            // } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
            //     Alert.alert("Report sending canceled.");
            // }
        } catch (error) {
            console.error("Failed to send email:", error);
            Alert.alert("Failed to send report via email.");
        }
    };

    return (
        <ThemedScreen
            showHeaderNavButton={false}
            showHeaderNavOptionButton={false}
            headerTitle={'Generate Reports'}
        >
            <StyledView className="flex-1 px-4">
                {/* Date Range Filter */}
                <StyledText className="font-bold text-lg text-accent mb-2">Date Range</StyledText>
                <StyledView className='flex-row'>
                    {/* Start Date Picker Section */}
                    <StyledView className="flex-1 mx-2">
                        <StyledTouchableOpacity
                            className="p-2 rounded-lg mb-2"
                            onPress={() => setShowStartDatePicker(true)}
                            style={{ backgroundColor: Colors.buttonSecondary }}
                        >
                            <StyledText className={`text-center font-bold text-primary`}>
                                Begin:{' '}
                                {startDate
                                    ? dayjs(startDate).format('MMM D, YYYY')
                                    : 'Start Date'}
                            </StyledText>
                        </StyledTouchableOpacity>

                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate|| new Date()}
                                mode="date"
                                display={'default'}
                                onChange={(event, date) => {
                                    setShowStartDatePicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setStartDate(date);
                                    }
                                }}
                                maximumDate={new Date()} // Prevent selecting future dates
                            />
                        )}
                    </StyledView>

                    {/* End Date Picker Section */}
                    <StyledView className="flex-1 mx-2">
                        <StyledTouchableOpacity
                            className="p-2 rounded-lg mb-2"
                            onPress={() => setShowEndDatePicker(true)}
                            style={{ backgroundColor: Colors.buttonSecondary }}
                        >
                            <StyledText className={`text-center font-bold text-primary`}>
                                End:{' '}
                                {endDate
                                    ? dayjs(endDate).format('MMM D, YYYY')
                                    : 'End Date'}
                            </StyledText>
                        </StyledTouchableOpacity>

                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate || new Date()}
                                mode="date"
                                display={'default'}
                                onChange={(event, date) => {
                                    setShowEndDatePicker(false);
                                    if (date && event.type !== 'dismissed') {
                                        setEndDate(date);
                                    }
                                }}
                                maximumDate={new Date()} // Prevent selecting future dates
                            />
                        )}
                    </StyledView>
                </StyledView>

                {/* Report Buttons/Data */}
                <StyledText className="font-bold text-lg text-accent mb-2">Report</StyledText>
                <StyledView className="flex-row">
                    <StyledView className="flex-1 mx-2">
                        <StyledTouchableOpacity
                            className="p-2 rounded-lg mb-2"
                            onPress={generateReport}
                            style={{ backgroundColor: startDate && endDate ? Colors.buttonPrimary : Colors.buttonPrimaryDisabled }}
                            disabled={!startDate || !endDate}
                        >
                            <StyledText className={`text-center font-bold text-primary`}>
                                {reportContent ? 'Generate New Report' : 'Generate Report'}
                            </StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                    <StyledView className="flex-1 mx-2">
                        <StyledTouchableOpacity
                            onPress={() => setExportModalVisible(true)}
                            style={{ backgroundColor: reportContent ? Colors.buttonAlternative : Colors.buttonAlternativeDisabled }}
                            disabled={!reportContent}
                            className="p-2 rounded-lg mb-2"
                        >
                            <StyledText className="text-primary text-center font-bold">Export Report</StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>

                {reportContent && (
                    <ReportContent reportContent={reportContent} />
                )}

            </StyledView>

            {/* Export Type Modal */}
            <ReportExportTypeModal
                visible={isExportModalVisible}
                onClose={() => setExportModalVisible(false)}
                onSendEmail={sendReportAsEmail}
                onExportFile={exportReportAsFile}
            />
        </ThemedScreen>
    );
}

export default ReportScreen;