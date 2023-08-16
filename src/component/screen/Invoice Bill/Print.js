import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import RNPrint from 'react-native-print';
import RenderHtml from 'react-native-render-html';
import {getData} from '../../Connection/FetchServices';

import AnimatedLottieView from 'lottie-react-native';
import moment from 'moment';

export default function Print({route}) {
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [bill, setBill] = useState('<html> <div>Hii</div></html>');
  const [billData, setBillData] = useState({});
  const [loader, setLoader] = useState(false);
  const [billDataLineItems, setBillDataLineItems] = useState([]);

  const fetchDataForBill = async () => {
    setLoader(true);
    const result = await getData('bill/bybill/' + route.params.bill_id);
    console.log(result.data);

    if (result.status) {
      setBillData(result.data);
      setBillDataLineItems(result.data.lineitems);
    }
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  useEffect(function () {
    fetchDataForBill();
  }, []);

  const printHTML = async () => {
    await RNPrint.print({
      html: `<html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
        />
      </head>
      <body>
        <div>
          <div>
            <center>Tax Invoice</center>
          </div>
          <div class="row">
            <div class="input-field col s8">
              <div>Sold By:${billData.store_name}</div>
              <div>
                <div>
                  Ship-from Address:
                  <span>${billData.store_address}</span>
                </div>

               
              </div>
            </div>
            <div
              class="input-field col s4 center"
              style="border: 1px dotted; padding: 2px">
              Invoice Number
              <span>#VWC-${billData.bill_id}</span>
              <div>Invoice Date:${moment(billData?.created_at).format(
                'D/M/YYYY',
              )}</div>
            </div>
          </div>
          <hr style="backgroundcolor: white; height: 1px" />
          <div class="row">
            <div class="input-field col s12">
              <div>Order ID: ${billData.bill_id}</div>
              <div>
                Order Date: ${moment(bill?.created_at).format('D/M/YYYY ')}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s6">
              <div>Bill To:-</div>
              <div>${billData.cname}</div>
              <div>
                ${billData.cmobile}, ${billData.cemail}
              </div>
            </div>
            <div class="input-field col s6">
              <div>Ship To:-</div>
              <div>${billData.cname}</div>
              <div>
                ${billData.cmobile}, ${billData.cemail}
              </div>
            </div>
          </div>
          <hr />

          <div class="row">
            <div class="input-field col s12">
              <table cellpadding="5" cellspacing="10">
                <tr>
                 <th  style="text-align:left;">S No.</th>
                 <th  style="text-align:left;">Title</th>
                 <th  style="text-align:center;">Quantity</th>
                 <th  style="text-align:right;">Price</th>
                 <th  style="text-align:right;">Offer Price</th>
                 

                </tr>
                ${getHTML()}
                <tr>
                  <th></th>
                  <th>Total</th>
                  <th  style="text-align:center;">${
                    billDataLineItems.length
                  }</th>
                  <th  style="text-align:right;">&#8377;${billData.mrp}.00</th>
                  <th  style="text-align:right;">&#8377;${
                    billData.total
                  }.00</th>
                </tr>
              </table>
            </div>
          </div>
          <div>
          Payment Method &nbsp;&nbsp;
          </div>

<div class="row">
            <div class="input-field col s12">
              <table cellpadding="5" cellspacing="10">
                <tr>
                 <th  style="text-align:center;">Cash</th>
                 <th  style="text-align:center;">UPI</th>
                 <th  style="text-align:center;">Finance Amount</th>
                 <th  style="text-align:center;">Cheque Amount</th>
                 <th  style="text-align:center;">Remaining Amount</th>
                 </tr>
                 <tr>
                 <th  style="text-align:center;">&#8377;${billData.cash}.00</th>
                 <th  style="text-align:center;">&#8377;${billData.upi}.00</th>
                 <th  style="text-align:center;">&#8377;${
                   billData.financeamount
                 }.00</th>
                 <th  style="text-align:center;">&#8377;${
                   billData.chequeamount
                 }.00</th>
                 <th  style="text-align:center;">&#8377;${
                   billData.remainingamount
                 }.00</th>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <div style="text-align:right;">
                Grand Total: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <span style="font-weight:bold;text-align:center;">&#8377;${
                  billData.total
                }.00</span>
                <div>${billData.store_name}</div>
                <div>Authorized Signatory</div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </body>
    </html>`,
    });
  };

  const printingOptions = () => {
    return (
      <View>
        {selectedPrinter && (
          <View>
            <Text>{`Selected Printer Name: ${selectedPrinter.name}`}</Text>
            <Text>{`Selected Printer URI: ${selectedPrinter.url}`}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.buttonStyle} onPress={selectPrinter}>
          <Text>Click to Select Printer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={silentPrint}>
          <Text>Click for Silent Print</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getHTML = () => {
    var str = '';
    billDataLineItems.map(
      (item, index) =>
        (str += `<tr>
        <th  >${index + 1}</th>
        <th>${item.model_name} ${item.category_name} ${item.brand_name}</th>
        <th  style="text-align:center;">${item.quantity || 1}</th>
        <th  style="text-align:right;">&#8377;${
          parseInt(item.price) * (item.quantity || 1)
        }.00
        </th>
        <th  style="text-align:right;">&#8377;${
          item.offerprice * (item.quantity || 1)
        }.00</th>
      </tr>`),
    );
    return str;
  };

  if (loader) {
    return (
      <AnimatedLottieView
        source={require('../../assets/TallyBudy Loader.json')}
        autoPlay
        loop
        style={{height: 100, alignSelf: 'center', display: 'flex'}}
      />
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && printingOptions()}
        <View style={{height: '90%', justifyContent: 'center'}}>
          <Text>
            <TouchableOpacity style={styles.buttonStyle} onPress={printHTML}>
              <Text>Click to Print Bill</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginVertical: 10,
  },
});
