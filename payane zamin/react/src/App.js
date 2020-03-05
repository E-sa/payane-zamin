import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pushSocket: null,
      //keeps number# and time 
      data_list:[],
      average:"داده کافی وجود ندارد"
    };
    this.connect = this.connect.bind(this);

}

componentDidMount() {
  this.connect();
}


  connect = () => {

    var pushSocket = new WebSocket("ws://localhost:8080");
 

    pushSocket.onmessage = function (event) {

      var today = new Date();



      console.log(event.data);
      //ui here
      if(event.data.endsWith("#")){


        this.setState(prevState => ({
          data_list: [
            [
              event.data,
              today.getHours()    + ":"  + 
              today.getMinutes()  + ":"  + 
              today.getSeconds(),
              " 2024-" +
              (today.getMonth()+1)+ '-'  +
              today.getDate()

            ],
             ...prevState.data_list
          ]
        })
        // , () => {
        //   console.log(this.state.data_list[0][1]);
        // }
        )

        var data_list = this.state.data_list
        //calculate number of items that comes in less than a minute
        var cal_average = 0 ;
        //calculate ultimate average every time
        var cal_average2 = 0 ;



        //last_data => time of the last data added to the list
        //last_data[0]=hour, last_data[1]=min, last_data[2]=sec
        const last_data = data_list[0][1].split(":")

        for (var i=0; i <data_list.length; i++){
          //compare_data =>time of the item we want to compare with the last item
          //compare_data[0]=hour, compare_data[1]=min, compare_data[2]=sec
         const compare_data = data_list[i][1].split(":")

          if
          (
            (last_data[0]===compare_data[0] && last_data[1]===compare_data[1])
             ||
            (last_data[1]-compare_data[1]===1 && parseInt(compare_data[2])>parseInt(last_data[2])) 
             ||
            (last_data[0]-compare_data[0]===1 && compare_data[1]-last_data[1]===59,compare_data[2]>last_data[2]) 
          )
          {
            cal_average  = cal_average + 1;
            cal_average2 = cal_average2 + parseInt(data_list[i][0]);
            // console.log(data_list[0][0],last_data,data_list[i][0],compare_data)
          }
          else{
            // console.log( last_data,compare_data)
            // console.log("boolean", last_data[1]-compare_data[1]===1 , parseInt(compare_data[2])>parseInt(last_data[2]))
            break;

          }

        }

        
        cal_average2 = cal_average2/cal_average
        this.setState({ average: cal_average2 })

        // console.log("cal_average=",cal_average)
        // console.log("cal_average2=", cal_average2)

      }
     }.bind(this)

      pushSocket.onopen = function (event) {
          //send empty message to initialize socket connnection
       pushSocket.send("");
      };

      pushSocket.onclose = function (event) {
      //send empty message to initialize socket connnection
      alert("Socket Closed by Server");
      };

      
  }

  render(){
   const subset = this.state.data_list.slice(0,30)


  return(
    <div className="container">

          <div className="average">
            <p>میانگین یک دقیقه آخر: </p><p>{this.state.average}</p>
          </div>

          <table> 
                <thead>
                    <tr>
                        <th>قیمت</th>
                        <th>زمان</th>
                        <th>ردیف</th>
                    </tr>  
                </thead>
                <thead>
                    {subset.map((arz, index) => (
                        <tr key={index}>
                            <td>{arz[0]}</td>
                            <td>{arz[1]}{arz[2]}</td>
                            <td>{index+1}</td>
                        </tr>
                      ))}
                </thead>
          </table>
    </div>

  )
  }
}
export default App;



