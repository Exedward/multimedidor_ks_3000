import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation'
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000*3600*24,
  enableCache: true,
  reconnect: true,
  sync:{
  },
})

const client = new Paho.MQTT.Client("wss://m16.cloudmqtt.com:34391/mqtt", "eduExpo")

var arrayLabelsText = ["1", "2", "3"]
var arrayDataValor = [30, 100, 60]
var contador = 3
const topicSub = "t1";
const topic = "t2"

ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

export default function App() {
  
  const [cont, setCont] = useState(3)
  const [labelsText, setLabelsText] = useState(["1", "2", "3"])
  const [dataValor, setDataValor] = useState([30, 100, 60])
  const [mensagem, setMensagem] = useState()

  useEffect(() => {
    /*const  interval = setInterval(() => {
      contador += 1
      setCont((contador) => contador+1)
      arrayLabelsText.push(contador.toString())
      arrayDataValor.push(Math.floor(Math.random()*200))
      if(arrayDataValor.length == 11){
        arrayDataValor.shift()
        arrayLabelsText.shift()
      }
      setLabelsText(arrayLabelsText)
      setDataValor(arrayDataValor)
      console.log(contador)
    }, 1500);*/
    console.log("Montado")
    client.onMessageArrived = onMessageArrived
    console.log(client._getPath())
    console.log(client._getURI())
    client.connect({
      useSSL: false,
      userName: 'lbhkbooa',
      password: '8fgN0cELBlX8',
      onSuccess: onConnect,
      onFailure: falha,
    })
    //return () => clearInterval(interval)
  }, [])

  function grafic(t){
    //contador += 1
    setCont(cont+1)
    arrayLabelsText.push(cont.toString())
    arrayDataValor.push(t)
    if(arrayDataValor.length == 11){
      arrayDataValor.shift()
      arrayLabelsText.shift()
    }
    setLabelsText(arrayLabelsText)
    setDataValor(arrayDataValor)
    console.log("Chegou: ")
    console.log(t)
  }
  
  const chartConfig = {
    backgroundGradientFrom: "#FF0000",
    backgroundGradientTo: "#FFF",
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 15, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
    barRadius: 1,
  };

  const data = {
    labels: labelsText,
    datasets: [
      {
        data: dataValor,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
        fillShadowGradient: '#FF0000',
        fillShadowGradientTo: '#FF0000',
      },
    ],
    legend: ["Rainy Days"] // optional
  };

  const onMessageArrived = (message) => {
    let texto =  message.payloadString
    console.log("onMessageArrived: " + texto)
    setMensagem(texto)
    grafic(texto)
  }

  const onConnect = () => {
    console.log("Conectado!")
    client.subscribe(topicSub)
    client.publish(topic, "ping")
  }

  const falha = () => {
    console.log("Falha")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Teste Line-Chart</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 10}
        height={250}
        chartConfig={chartConfig}
        withShadow={true}
        //xAxisLabel="A"
        xLabelsOffset={1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
