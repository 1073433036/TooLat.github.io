export default class Cordon {
  constructor() {
    this.xml = `<AlarmArea>
                  <CityEName>Guangdong</CityEName>
                  <CityCName>广东</CityCName>
                  <AreaLine Color="255,255,0">
                    <Area>
                      <Longitude>118.7</Longitude>
                      <Latitude>25</Latitude>
                    </Area>
                    <Area>
                      <Longitude>122</Longitude>
                      <Latitude>25</Latitude>
                    </Area>
                    <Area>
                      <Longitude>126</Longitude>
                      <Latitude>25</Latitude>
                    </Area>
                    <Area>
                      <Longitude>126</Longitude>
                      <Latitude>21</Latitude>
                    </Area>
                    <Area>
                      <Longitude>119</Longitude>
                      <Latitude>14</Latitude>
                    </Area>
                    <Area>
                      <Longitude>114.5</Longitude>
                      <Latitude>14</Latitude>
                    </Area>
                    <Area>
                      <Longitude>109.5</Longitude>
                      <Latitude>14</Latitude>
                    </Area>
                    <Area>
                      <Longitude>109.5</Longitude>
                      <Latitude>17</Latitude>
                    </Area>
                    <Area>
                      <Longitude>109.5</Longitude>
                      <Latitude>18.2</Latitude>
                    </Area>
                  </AreaLine>
                  <AreaLine Color="255,0,0">
                    <Area>
                      <Longitude>122</Longitude>
                      <Latitude>25</Latitude>
                    </Area>
                    <Area>
                      <Longitude>121</Longitude>
                      <Latitude>21</Latitude>
                    </Area>
                    <Area>
                      <Longitude>117</Longitude>
                      <Latitude>17</Latitude>
                    </Area>
                    <Area>
                      <Longitude>109.5</Longitude>
                      <Latitude>17</Latitude>
                    </Area>
                  </AreaLine>
                  <AreaCircle color="50,0,255,0" center="115.7,20.8" radius="1389"/>
                  <AreaCircle color="50,255,255,0" center="115.7,20.8" radius="1112"/>
                  <AreaCircle color="50,255,110,0" center="115.7,20.8" radius="834"/>
                  <AreaCircle color="50,255,0,0" center="115.7,20.8" radius="463"/>
                </AlarmArea>`;
  }

  private xml: string

  getLines() {
    let xmlData = (new DOMParser).parseFromString(this.xml,"text/xml");
    let redLine = [], yellowLine = [];
    let child = xmlData.getElementsByTagName('AreaLine');
    let subChild1 = child[0].children;
    let subChild2 = child[1].children;

    for(let i = 0; i < subChild1.length; i++) {
      yellowLine.push(Number(subChild1[i].children[0].textContent), Number(subChild1[i].children[1].textContent));
    }

    for(let i = 0; i < subChild2.length; i++) {
      redLine.push(Number(subChild2[i].children[0].textContent), Number(subChild2[i].children[1].textContent));
    }

    return {
      red: redLine,
      yellow: yellowLine
    }
  }

  getBounds() {
    let xmlData = (new DOMParser).parseFromString(this.xml,"text/xml");
    let child = xmlData.getElementsByTagName('AreaLine');
    let subChild1 = child[0].children;
    let subChild2 = child[1].children;
    let redLngs = [], redLats = [], yellowLngs = [], yellowLats = [];
    for(let i = 0; i < subChild1.length; i++) {
      yellowLngs.push(Number(subChild1[i].children[0].textContent));
      yellowLats.push(Number(subChild1[i].children[1].textContent));
    }

    for(let i = 0; i < subChild2.length; i++) {
      redLngs.push(Number(subChild2[i].children[0].textContent));
      redLats.push(Number(subChild2[i].children[1].textContent));
    }

    return {
      red: {
        lng: Math.max(...redLngs),
        lat: Math.min(...redLats)
      },
      yellow: {
        lng: Math.max(...yellowLngs),
        lat: Math.min(...yellowLats)
      }
    }
  }
}