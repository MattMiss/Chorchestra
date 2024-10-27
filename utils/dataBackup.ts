import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import dayjs from '@/utils/dayjsConfig';
import { BackupData } from '@/types';

// Function to export data as a JSON file and share it
export const exportData = async (data: BackupData) => {
    try {
        const json = JSON.stringify(data, null, 2);
        const timestamp = dayjs().format('YYYYMMDD_HHmmss');
        const fileName = `backup_${timestamp}.json`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, json, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: 'Export Data',
                UTI: 'public.json',
            });
        } else {
            Alert.alert('Export Data', `Backup file saved to: ${fileUri}`);
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        Alert.alert('Export Failed', 'An error occurred while exporting data.');
    }
};

// Function to import data from a JSON file
export const importData = async (): Promise<BackupData | null> => {
    try {
        // Open the document picker for JSON files
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        // Check if the user canceled the picker
        if (result.canceled) {
            Alert.alert('Import Cancelled', 'No file was selected.');
            return null;
        }

        // Extract the file object from the result
        const file = result.assets?.[0]; // Access the first file, if multiple selection is disabled

        if (!file || !file.uri) {
            Alert.alert('Invalid File', 'The selected file could not be read.');
            return null;
        }

        // Read the file content as a string
        const fileContent = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        // Parse the JSON string into an object
        const data: BackupData = JSON.parse(fileContent);

        // Validate the structure of the imported data
        if (
            !data ||
            !Array.isArray(data.chores) ||
            !Array.isArray(data.tags) ||
            !Array.isArray(data.entries)
        ) {
            throw new Error('Invalid backup file format.');
        }

        return data;
    } catch (error) {
        console.error('Error importing data:', error);
        Alert.alert('Import Failed', 'An error occurred while importing data.');
        return null;
    }
};
