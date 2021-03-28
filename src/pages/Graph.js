import { useEffect, useState } from "react";
import axios from 'axios'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import '../App.css'
import { Paper, TextField } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import Footer from "../components/Footer";

const baseURL = "https://api.stackexchange.com/2.2/tags?"

function Graph() {

    const [xData, setXData] = useState([])
    const [yData, setYData] = useState([])
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const handleFromDate = (date) => {
        setFromDate(date);
    };

    const handleToDate = (date) => {
        setToDate(date);
    };

    const chartOptions= {
        title: {
            text: 'My StackOverFlow Chart'
        },
        xAxis: {
            categories: xData,  
        },
        yAxis:{
            min: 0,
            title: {
                text: "Tag's count"
            }
        },
        series: [
            {name:'Languages', type: 'column', data: yData }
        ]
    }
    
    const loadData = () =>{
        let from = (new Date(fromDate)).getTime()
        let to = (new Date(toDate)).getTime()
        axios.get(baseURL+`page=${page}&pagesize=${pageSize}&${from>0 ? "from="+from+"&" : ""}${from>0 ? "to="+to+"&" : ""}order=desc&site=stackoverflow`).then(response=>{
            let x = [], y=[] 
            response.data.items.map(record => {
                x.push(record.name)
                y.push(record.count)
            })
            setXData(x)
            setYData(y)
        })
    }

    const handleSearch = () => {
        loadData();
    };

    useEffect(()=>{
        loadData()
    },[])

    return (
        <>
        <div className="graph">
            <Paper className="controlls">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around" alignItems="center">   
                        <TextField
                            variant="outlined"
                            value={page}
                            style={{height:'40px',marginTop:'10px'}}
                            inputProps={{
                               style: {padding: "12px 7px"}
                            }}
                            onChange={(event)=>setPage(event.target.value)} 
                            placeholder={"Page"}
                            label="Page"
                        />
                        <TextField 
                            label="Page Size"
                            variant="outlined"
                            value={pageSize}
                            onChange={(event)=>setPageSize(event.target.value)} 
                            style={{height:'40px',marginTop:'10px'}}
                            inputProps={{
                                style: {padding: "12px 7px"}
                            }}
                            placeholder={"PageSize"}
                        />     
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="From Date"
                            value={fromDate}
                            onChange={handleFromDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{marginTop:'10px'}}
                        />
                        
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="To Date"
                            value={toDate}
                            onChange={handleToDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{marginTop:'10px'}}
                        />
                        <Button 
                            onClick={()=> handleSearch() } color="primary" variant="contained" 
                            style={{height:'40px', margin:"10px 0 o 15px"}} 
                        > Search </Button>
                    </Grid>
                </MuiPickersUtilsProvider>    
            </Paper>
            <Paper style={{padding:'2px'}}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </Paper>
        </div>
        <Footer/>
        </>
    );
}
  
export default Graph;
  