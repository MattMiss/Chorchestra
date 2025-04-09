// src/components/ChartComponent.tsx

import React, {useEffect, useMemo} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {Picker} from '@react-native-picker/picker';
//import {styled} from 'nativewind';
import dayjs from '@/utils/dayjsConfig';
import {Colors} from '@/constants/Colors';
import {ProcessedEntry} from '@/types';
import {FontAwesome} from "@expo/vector-icons";

// const View = styled(View);
// const Text = styled(Text);
// const TouchableOpacity = styled(TouchableOpacity);

const { width: screenWidth } = Dimensions.get('window');

interface ChartComponentProps {
    data: ProcessedEntry[];
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
                ? (index === 0 || ((index + 1) % 5 === 0) ? dayjs(date).format('D') : '') // Add label only every 5 days for 'month'
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
        //console.log(JSON.stringify(chartData, null, 2));
    }, [chartData]);


    // Calculate max Y-axis value and ensure whole number increments
    const maxYValue = Math.max(...chartData.map(point => point.value), 1);  // Ensure at least 1 as max
    const noOfSections = maxYValue <= 5 ? maxYValue : 5;  // Dynamically set sections
    const stepValue = maxYValue <= 1 ? 1 : Math.ceil(maxYValue / noOfSections);  // Force step to 1 if max is 1 or less

    return (
        <View className="flex-1">
            {/* Time Range Picker */}
            <View className="py-1">
                <View className="px-4 flex-row items-center">
                    {/* Label */}
                    <Text className="text-xl text-secondary">Timeframe</Text>
                    <TouchableOpacity
                        onPress={() => changeScale("decrease")}
                        disabled={timeRange === "week"}
                        className="my-4 p-2 rounded-lg ml-4"
                        style={{ backgroundColor: timeRange === "week" ? Colors.buttonSecondary : Colors.buttonPrimary }}
                    >
                        <FontAwesome name="minus" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={timeRange === "thisYear"}
                        onPress={() => changeScale("increase")}
                        className="my-4 p-2 rounded-lg ml-2"
                        style={{ backgroundColor: timeRange === "thisYear" ? Colors.buttonSecondary : Colors.buttonPrimary }}
                    >
                        <FontAwesome name="plus" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Picker Container */}
                <View className="px-4 flex-row items-center">
                    <Picker
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
                    </Picker>
                </View>
            </View>

            <View className="pt-6">
                {/* Line Chart */}
                {chartData.length > 0 ? (
                    <LineChart
                        labelsExtraHeight={10}
                        data={chartData}
                        areaChart
                        rotateLabel
                        animateOnDataChange
                        initialSpacing={15}
                        endSpacing={10}
                        overflowTop={60}
                        thickness={1}
                        dataPointsColor={Colors.accent}
                        color={Colors.accent}
                        xAxisColor={Colors.textPrimary}
                        yAxisColor={Colors.textPrimary}
                        xAxisLabelTextStyle={{ color: Colors.textPrimary, fontSize: 10, paddingRight: 6, paddingTop:5}}
                        yAxisTextStyle={{ color: Colors.textPrimary }}
                        startFillColor={Colors.accent}
                        endFillColor={Colors.accent}
                        startOpacity={0.3}
                        endOpacity={0.01}
                        width={screenWidth * 0.8}
                        adjustToWidth
                        maxValue={stepValue * noOfSections}
                        noOfSections={noOfSections}
                        stepValue={stepValue}
                        formatYLabel={(value) => `${Math.round(Number(value))}`}
                        pointerConfig={{
                            pointerColor: Colors.buttonAlternative,
                            pointerStripColor: Colors.buttonAlternative,
                            pointerLabelComponent: (items: { value: number, date: string}[]) => {
                                return (
                                    <View className="flex-row w-[100] mt-[-20] ml-8 p-2 rounded bg-popup">
                                        <Text className="text-primary">
                                            {items[0].value}
                                        </Text>
                                        <Text className="text-primary">
                                            {" - "}
                                        </Text>
                                        <Text className="text-primary">
                                            {dayjs(items[0].date).format('ddd MMM D')}
                                        </Text>
                                    </View>
                                )
                            }
                        }}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-lg text-secondary">No data available for this range.</Text>
                    </View>
                )}
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        color: Colors.textPrimary,
    },
    pickerItem: {
        color: Colors.textPrimary,
        backgroundColor: Colors.backgroundMedium,
    },
});

export default ChartComponent;
