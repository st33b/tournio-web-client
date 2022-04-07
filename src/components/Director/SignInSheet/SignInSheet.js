import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import {useDirectorContext} from "../../../store/DirectorContext";
import {useEffect} from "react";

const SignInSheet = ({bowler}) => {
  const context = useDirectorContext();

  if (!bowler || !context) {
    return '';
  }

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    page: {
      margin: 20,
      color: '#333',
      fontSize: 12,
      lineHeight: 1.3,
    },
    section: {
      // margin: 10,
      // padding: 10,
      paddingVertical: 12,
      borderBottom: 1,
      maxWidth: '93%',
      borderColor: '#999',
      flexDirection: 'row',
    },
    image: {
      maxWidth: 80,
      maxHeight: 80,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 20,
    },
    bowlerName: {
      fontSize: 16,
      textAlign: 'center',
      width: '100%',
    },
    contactInfo: {
      width: '50%',
    },
    bowlingInfo: {
      width: '50%',
    },
    bowlingInfoLabel: {
      width: '60%',
      textAlign: 'right',
      paddingRight: 8,
    },
    teamInfoLabel: {
      width: '40%',
      textAlign: 'right',
      paddingRight: 8,
    },
    addressLine: {
      paddingLeft: 5,
    },
  });

  return (
    <PDFViewer style={styles.viewer}>
      <Document title={'Bowler Sign-in Sheet'}>
        <Page size={'LETTER'} style={styles.page}>
          <View style={styles.section} wrap={false}>
            <View style={styles.header}>
              <Image style={styles.image}
                     src={context.tournament.image_path} />
              <Text style={{ paddingLeft: 10 }}>
                {context.tournament.name} {context.tournament.year}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.bowlerName}>
              {bowler.last_name}, {bowler.preferred_name.length > 0 && bowler.preferred_name} {bowler.preferred_name.length === 0 && bowler.first_name}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.contactInfo}>
              <Text style={{ paddingBottom: 10 }}>
                Mailing Address:
              </Text>
              <Text style={styles.addressLine}>
                {bowler.address1}
              </Text>
              {bowler.address2 && <Text style={styles.addressLine}>{bowler.address2}</Text>}
              <Text style={styles.addressLine}>
                {bowler.city}, {bowler.state}
              </Text>
              <Text style={styles.addressLine}>
                {bowler.postal_code}
              </Text>
              <Text style={styles.addressLine}>
                {bowler.country}
              </Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={{ paddingBottom: 12 }}>
                Birthday: {bowler.birth_month} / {bowler.birth_day}
              </Text>
              <Text>
                Phone: {bowler.phone}
              </Text>
              <Text>
                Email: {bowler.email}
              </Text>
              <Text style={{ paddingTop: 12 }}>
                USBC Number: {bowler.usbc_id}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={{ width: '40%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.bowlingInfoLabel}>
                  Tournament Average
                </Text>
                <Text>
                  {bowler.verified_average}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.bowlingInfoLabel}>
                  Tournament Handicap
                </Text>
                <Text>
                  {bowler.handicap}
                </Text>
              </View>
            </View>
            <View style={{ width: '60%' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.teamInfoLabel}>
                  Team Name
                </Text>
                <Text>
                  {bowler.team.name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.teamInfoLabel}>
                  Doubles Partner
                </Text>
                <Text>
                  {bowler.doubles_partner}
                </Text>
              </View>
            </View>
          </View>

        </Page>
      </Document>
    </PDFViewer>
  );
}

export default SignInSheet;