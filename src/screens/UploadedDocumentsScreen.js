import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import { pickDocument } from "react-native-file-access";
import Colors from "../utilities/colors";
import Fonts from "../utilities/fonts";

export default function UploadedDocumentsScreen() {
  const navigation = useNavigation();

  const [documents, setDocuments] = useState([
    { id: "1", title: "Driver ID", status: "not_uploaded" },
    { id: "2", title: "License", status: "not_uploaded" },
    { id: "3", title: "Vehicle Documents", status: "not_uploaded" },
  ]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "not_uploaded":
        return { text: "Not uploaded", color: Colors.gray600 };
      case "uploaded":
        return { text: "Uploaded", color: Colors.success };
      case "pending":
        return { text: "Pending review", color: Colors.warning };
      default:
        return { text: "Not uploaded", color: Colors.gray600 };
    }
  };

  const getRightIcon = (status) => {
    switch (status) {
      case "not_uploaded":
        return (
          <Icon
            source="cloud-upload-outline"
            size={22}
            color={Colors.gray600}
          />
        );
      case "uploaded":
        return <Icon source="pencil" size={20} color={Colors.gray600} />;
      case "pending":
        return <Icon source="clock-outline" size={20} color={Colors.warning} />;
      default:
        return (
          <Icon
            source="cloud-upload-outline"
            size={22}
            color={Colors.gray600}
          />
        );
    }
  };

  const getLeftIcon = (title) => {
    if (title.includes("License")) {
      return <Icon source="key" size={22} color={Colors.primary} />;
    } else if (title.includes("Vehicle")) {
      return <Icon source="file-document" size={22} color={Colors.primary} />;
    } else {
      return (
        <Icon source="card-account-details" size={22} color={Colors.primary} />
      );
    }
  };

  const handleAction = async (doc) => {
    if (doc.status === "not_uploaded") {
      try {
        // Use react-native-file-access to pick document
        const document = await pickDocument({
          mode: "open",
          allowMultiSelection: false,
          type: ["public.item"], // Allows all file types
        });

        if (document && document.length > 0) {
          const file = document[0];
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id
                ? {
                    ...d,
                    status: "uploaded",
                    fileUri: file.uri,
                    fileName: file.name,
                    fileSize: file.size
                  }
                : d
            )
          );
          Alert.alert("Success", `${doc.title} uploaded successfully`);
        }
      } catch (err) {
        console.error("Document picker error:", err);
        if (err.code === "E_PICKER_CANCELLED") {
          // User cancelled the picker
        } else {
          Alert.alert("Error", "Something went wrong while picking document");
        }
      }
    } else if (doc.status === "uploaded") {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, status: "pending" } : d
        )
      );
      Alert.alert("Info", `${doc.title} sent for review`);
    } else {
      Alert.alert("Pending", `${doc.title} is under review`);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon source="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: Colors.primary }]}>
          Uploaded Documents
        </Text>
      </View>

      {documents.map((doc) => {
        const statusInfo = getStatusLabel(doc.status);

        return (
          <TouchableOpacity
            key={doc.id}
            style={[
              styles.card,
              { backgroundColor: Colors.white, borderColor: Colors.border },
            ]}
            onPress={() => handleAction(doc)}
          >
            <View style={styles.leftSection}>
              {getLeftIcon(doc.title)}

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.cardTitle, { color: Colors.textPrimary }]}>
                  {doc.title}
                </Text>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.text}{" "}
                  {doc.status === "uploaded" && (
                    <Icon
                      source="check-circle"
                      size={14}
                      color={Colors.success}
                    />
                  )}
                </Text>
                {doc.fileName && (
                  <Text style={[styles.fileInfo, { color: Colors.gray600 }]}>
                    {doc.fileName}
                  </Text>
                )}
              </View>
            </View>

            {getRightIcon(doc.status)}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.urbanist.bold,
    marginLeft: 16,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.urbanist.medium,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 13,
    fontFamily: Fonts.urbanist.regular,
    marginBottom: 2,
  },
  fileInfo: {
    fontSize: 11,
    fontFamily: Fonts.urbanist.regular,
    fontStyle: "italic",
  },
});