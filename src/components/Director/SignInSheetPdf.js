import {Document, Page, Text, View, StyleSheet} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
  },
  section: {
    flowGrow: 1,
  },
});

const SignInSheetPdf = ({bowler}) => {
  if (!bowler) {
    return '';
  }

  return (
    <Document>
      <Page size={'LETTER'}
            style={styles.page}
            >
        <View style={styles.section}>
          <Text>
            {bowler.tournament.name} {bowler.tournament.year}
          </Text>
        </View>
        <View style={styles.section}>
          {bowler.full_name}
        </View>
      </Page>
    </Document>
  );
}

export default SignInSheetPdf;
