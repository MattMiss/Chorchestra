// src/components/ChartComponent.tsx

import React, {useEffect, useMemo} from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker';
import { styled } from 'nativewind';
import dayjs from '@/utils/dayjsConfig';
import { Colors } from '@/constants/Colors';
import { Entry } from '@/types';
import {FontAwesome} from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPicker = styled(Picker);
const StyledTouchableOpacity = styled(TouchableOpacity);

const { width: screenWidth } = Dimensions.get('window');

interface ChartComponentProps {
    data: Entry[];
    timeRange: string;
    onTimeRangeChange: (range: string) => void;
}

const timeRanges = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: '6 Months', value: '6months' },
    { label: '1 Year Back', value: '1yearBack' },
    { label: 'This Year', value: 'thisYear' },
];

const ChartComponent: React.FC<ChartComponentProps> = ({ data, timeRange, onTimeRangeChange }) => {
    const chartData = useMemo(() => {
        const dateMap: { [key: string]: number } = {};
        const today = dayjs();

        if (timeRange === 'month') {
            // Populate all days of the current month
            const startOfMonth = today.startOf('month');
            const endOfMonth = today.endOf('month');
            let currentDate = startOfMonth;

            while (currentDate.isBefore(endOfMonth) || currentDate.isSame(endOfMonth)) {
                dateMap[currentDate.format('YYYY-MM-DD')] = 0;
                currentDate = currentDate.add(1, 'day');
            }
        } else if (timeRange === 'week') {
            for (let i = 6; i >= 0; i--) { // Start from 6 days ago to today
                const day = today.subtract(i, 'day');
                dateMap[day.format('YYYY-MM-DD')] = 0;
            }
        } else if (timeRange === '6months' || timeRange === '1yearBack') {
            // Populate all months in the past 6 months or 1 year back
            const monthsToShow = timeRange === '6months' ? 6 : 12;
            for (let i = monthsToShow - 1; i >= 0; i--) {
                const month = today.subtract(i, 'month').startOf('month').format('YYYY-MM');
                dateMap[month] = 0;
            }
        } else if (timeRange === 'thisYear') {
            // Populate months from January to December for the current year
            for (let i = 0; i < 12; i++) {
                const month = today.startOf('year').add(i, 'month').format('YYYY-MM');
                dateMap[month] = 0;
            }
        }

        // Count entries for each date within the specified dateMap keys only
        data.forEach(entry => {
            const date = dayjs(entry.dateCompleted);
            let key = '';

            switch (timeRange) {
                case 'week':
                case 'month':
                    key = date.format('YYYY-MM-DD');
                    break;
                case '6months':
                case '1yearBack':
                case 'thisYear':
                    key = date.startOf('month').format('YYYY-MM');
                    break;
                default:
                    break;
            }

            // Only update dateMap if the key exists (i.e., it's within the expected range)
            if (key in dateMap) {
                dateMap[key] += 1;
            }
        });

        const sortedKeys = Object.keys(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        return sortedKeys.map((date, index) => ({
            value: dateMap[date],
            date: date,
            label: timeRange === 'month'
                ? (index % 5 === 0 ? dayjs(date).format('D') : '') // Add label only every 5 days for 'month'
                : timeRange === 'week'
                    ? dayjs(date).format('ddd D') // Format as "Wed 10" for 'week'
                    : dayjs(date).format('MMM'),  // Label as month name for other cases
        }));
    }, [data, timeRange]);

    const changeScale = (direction: "decrease" | "increase") => {
        const currentIndex = timeRanges.findIndex(range => range.value === timeRange);
        if (currentIndex === -1) return; // If the current range is not found, do nothing

        if (direction === "decrease" && currentIndex > 0) {
            const newRange = timeRanges[currentIndex - 1].value;
            onTimeRangeChange(newRange);
        } else if (direction === "increase" && currentIndex < timeRanges.length - 1) {
            const newRange = timeRanges[currentIndex + 1].value;
            onTimeRangeChange(newRange);
        }
    };

    useEffect(() => {
        console.log(JSON.stringify(chartData, null, 2));
    }, [chartData]);

    // Calculate max Y-axis value and ensure whole number increments
    const maxYValue = Math.max(...chartData.map(point => point.value), 1);
    const noOfSections = maxYValue <= 5 ? maxYValue : 5;
    const stepValue = Math.ceil(maxYValue / noOfSections);

    return (
        <StyledView className="flex-1">
            {/* Time Range Picker */}
            <StyledView className="py-1">
                <StyledView className="flex-row items-center">
                    {/* Label */}
                    <StyledText className="text-xl text-secondary">Timeframe</StyledText>
                    <StyledTouchableOpacity
                        onPress={() => changeScale("decrease")}
                        disabled={timeRange === "week"}
                        className="my-4 p-2 rounded-lg ml-4"
                        style={{ backgroundColor: timeRange === "week" ? Colors.buttonSecondary : Colors.buttonPrimary }}
                    >
                        <FontAwesome name="minus" size={20} color={Colors.textPrimary} />
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        disabled={timeRange === "thisYear"}
                        onPress={() => changeScale("increase")}
                        className="my-4 p-2 rounded-lg ml-2"
                        style={{ backgroundColor: timeRange === "thisYear" ? Colors.buttonSecondary : Colors.buttonPrimary }}
                    >
                        <FontAwesome name="plus" size={20} color={Colors.textPrimary} />
                    </StyledTouchableOpacity>
                </StyledView>

                {/* Picker Container */}
                <StyledView className="flex-row items-center pl-1">
                    <StyledView className="flex-grow">
                        <StyledPicker
                            selectedValue={timeRange}
                            onValueChange={(value) => onTimeRangeChange(value as string)}
                            mode="dropdown"
                            dropdownIconColor={Colors.textPrimary}
                            style={styles.picker}
                        >
                            {timeRanges.map(range => (
                                <Picker.Item
                                    key={range.value}
                                    label={range.label}
                                    value={range.value}
                                    style={styles.pickerItem}
                                />
                            ))}
                        </StyledPicker>
                    </StyledView>
                </StyledView>
            </StyledView>

            <StyledView className="pt-6">
                {/* Line Chart */}
                {chartData.length > 0 ? (
                    <LineChart
                        data={chartData}
                        initialSpacing={0}
                        overflowTop={60}
                        overflowBottom={60}
                        thickness={2}
                        color={Colors.accent}
                        xAxisColor={Colors.textPrimary}
                        yAxisColor={Colors.textPrimary}
                        xAxisLabelTextStyle={{ color: Colors.textPrimary, fontSize: 12, width: 50, textAlign: 'left', paddingLeft: 4 }}
                        yAxisTextStyle={{ color: Colors.textPrimary }}
                        startFillColor={Colors.accent}
                        startOpacity={0.3}
                        endFillColor={Colors.accent}
                        endOpacity={0.01}
                        dataPointsColor={Colors.accent}
                        areaChart
                        width={screenWidth - 130}
                        adjustToWidth
                        maxValue={stepValue * noOfSections}
                        noOfSections={noOfSections}
                        stepValue={stepValue}
                        rotateLabel
                        animateOnDataChange
                        endSpacing={0}
                        pointerConfig={{
                            pointerColor: Colors.buttonAlternative,
                            pointerStripColor: Colors.buttonAlternative,
                            pointerLabelComponent: (items: { value: number, date: string}[]) => {
                                return (
                                    <StyledView className="flex-row w-[100] mt-[-20] ml-8 p-2 rounded bg-popup">
                                        <StyledText className="text-primary">
                                            {items[0].value}
                                        </StyledText>
                                        <StyledText className="text-primary">
                                            {" - "}
                                        </StyledText>
                                        <StyledText className="text-primary">
                                            {dayjs(items[0].date).format('ddd MMM D')}
                                        </StyledText>
                                    </StyledView>
                                )
                            }
                        }}
                    />
                ) : (
                    <StyledView className="flex-1 justify-center items-center">
                        <StyledText className="text-lg text-secondary">No data available for this range.</StyledText>
                    </StyledView>
                )}
            </StyledView>

        </StyledView>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 40,
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
        fontSize: 18,
    },
});

export default ChartComponent;
