import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  eventInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
});

const TicketPDF = ({ event, bookingUser }: any) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Event Ticket</Text>
        <View style={styles.eventInfo}>
          <Text style={styles.label}>Event:</Text>
          <Text style={styles.info}>{event.title}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.info}>{event.date}</Text>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.info}>{event.time}</Text>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.info}>{event.location}</Text>
          <Text style={styles.label}>Organized by:</Text>
          <Text style={styles.info}>{event.user.username}</Text>
          <Text style={styles.label}>You are Welcome:</Text>
          <Text style={styles.info}>{bookingUser}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
