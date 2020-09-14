import React, { useContext, useState, useEffect } from 'react';
import { Button, Card, CardBody, CustomInput, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { getPosition, getGrays, themeColors, rgbaColor, isIterableArray, capitalize } from '../../helpers/utils';
import AppContext from '../../context/Context';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import axios from 'axios';
import { getGlobalDsaCount } from '../../helpers/dsaInterface';

// import { DSA_API_KEY } from '../../config';

function getFormatter(params) {
  const { name, value } = params[0];
  return `${name}, ${value}`;
}

const getOption = (xValues, yValues, isDark) => {
  const grays = getGrays(isDark);
  return {
    tooltip: {
      trigger: 'axis',
      padding: [7, 10],
      backgroundColor: grays.white,
      borderColor: grays['300'],
      borderWidth: 1,
      textStyle: { color: themeColors.dark },
      formatter(params) {
        return getFormatter(params);
      },
      transitionDuration: 0,
      position(pos, params, dom, rect, size) {
        return getPosition(pos, params, dom, rect, size);
      }
    },
    xAxis: {
      type: 'category',
      data: xValues,
      boundaryGap: false,
      axisPointer: {
        lineStyle: {
          color: grays['300'],
          type: 'dashed'
        }
      },
      splitLine: { 
        show: false,
      },
      axisLine: {
        show:false,
        lineStyle: {
          color: rgbaColor('#000',0.2),
          type: 'dashed'
        }
      },
      axisTick: { show: false },
      axisLabel: {
        color: grays['400'],
        margin: 15
      }
    },
    yAxis: {
      type: 'value',
      axisPointer: { show: false },
      splitLine: { show: false },
      boundaryGap: false,
      axisLabel: {
        show: true,
        color: grays['400'],
        margin: 15,
        formatter: function(value) {
          if(value>=1000) 
            return Math.round((value*100)/1000)/100+ 'K';
          return value;
        }
      },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    series: [
      {
        type: 'line',
        data: yValues,
        lineStyle: { color: themeColors.light },
        itemStyle: {
          color: isDark ? themeColors.dark : themeColors.primary,
          borderColor: themeColors.light,
          borderWidth: 2
        },
        symbol: 'circle',
        symbolSize: 4.75,
        smooth: false,
        hoverAnimation: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: rgbaColor(themeColors.light, 0.5)
              },
              {
                offset: 1,
                color: rgbaColor(themeColors.light, 0)
              }
            ]
          }
        }
      }
    ],
    animationDuration: 1000,
    grid: { right: '28px', left: '40px', bottom: '15%', top: '5%' }
  };
};

const CreationTimeline = ({ className }) => {

  const { isDark } = useContext(AppContext);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const timeIntervals = ['past year', 'past month', 'past week'];
  const [interval, setInterval] = useState(timeIntervals[1]);
  const [isIntervalSelected, setIsIntervalSelected] = useState({'past year':false, 'past month':true, 'past week':false,});
  const [counts, setCounts] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [isCountsUpdated, setIsCountsUpdated] = useState(false);
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);

  const updateCreationCounts = async () => {
    try {
      // Before deploying store key and url in env variables
      const creationCountUrl = `https://dsa-info.herokuapp.com/api/dsa/creation/counts?key=Er2wUbHQ8hYADskWFk9JQntnf`;
      const [countsResponse, totalCount]  = await Promise.all([axios.get(creationCountUrl),getGlobalDsaCount()]);
      const { data } = countsResponse.data;
      setCounts(data);
      setTotalCount(totalCount);
      setIsCountsUpdated(true);
    }
    catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateCreationCounts()
        .then(() => updateChart(interval))
        .catch(err => console.log(err));
  }, [isCountsUpdated])


  const isLeapYear = year => (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);

  const getDatesBetweenDates = (startDate, endDate) => {
    const dates = [];
    const theDate = new Date(startDate.valueOf()+24*60*60*1000);
    while (theDate < endDate) {
      const day = theDate.getUTCDate();
      const monthIndex = theDate.getUTCMonth();
      const year = theDate.getUTCFullYear();
      dates.push(day+' '+months[monthIndex]+' '+year);
      theDate.setDate(theDate.getDate() + 1);
    }
    dates.push(endDate.getUTCDate()+' '+months[endDate.getUTCMonth()]+' '+endDate.getUTCFullYear());
    return dates;
  }
  
  const getPastYearMonths = ( ) => {
    const monthsInPastYear=[];
    const toDate = new Date();
    const minusDuration = (isLeapYear(toDate.getUTCFullYear()) ? 366 : 365)*24*60*60*1000;
    const fromDate = new Date(toDate.valueOf() - minusDuration);
    let i = 0;
    let currentMonthIndex = fromDate.getUTCMonth() + 1;
    let currentYear = fromDate.getUTCFullYear();
    while(i<12) {
      if(i==0)
        monthsInPastYear.push(months[currentMonthIndex]+' '+currentYear);
      else {
       if(currentMonthIndex==12) {
         currentMonthIndex=0;
         currentYear=toDate.getUTCFullYear();
       }
       monthsInPastYear.push(months[currentMonthIndex]+' '+currentYear);
      }
      currentMonthIndex++;
      i++;
    }
    return monthsInPastYear;
  }

  const updateChart = currentInterval => {
    // Past Year
    if(currentInterval==timeIntervals[0]) { 
      const xVals=[];
      const yVals=[];
      const monthsInPastYear = getPastYearMonths();
      for(const monthElt of monthsInPastYear) {
        const [month,year] = monthElt.split(' ');
        xVals.push(month+' '+year.toString().substring(2));
        const yVal = counts[year] ? (counts[year][month] ? counts[year][month].count : 0) : 0;
        yVals.push(yVal);
      }
      setXValues(xVals);
      setYValues(yVals);
    }
    // Past Month or Past Week
    if(currentInterval==timeIntervals[1] || currentInterval==timeIntervals[2]) {
    const xVals=[];
    const yVals = [];
    const toDay = new Date();
    const currentMonth = months[toDay.getUTCMonth()];
    const thirtyOneDaysInMonth = {'Jan':true, 'Mar':true,'May':true,'Jul':true,'Aug':true,'Oct':true,'Dec':true };
    const minusDuration = {
      'past month':(thirtyOneDaysInMonth[currentMonth] ? 31 : 30)*24*60*60*1000, 
      'past week': 7*24*60*60*1000
    };
    const fromDay = new Date(toDay.valueOf()-minusDuration[currentInterval]);
    const dates = getDatesBetweenDates(fromDay, toDay);
      for(const date of dates) {
        const [day, month, year] = date.split(' ');
        xVals.push(day+' '+month)
        const yVal = counts[year] ? (counts[year][month] ? (counts[year][month][day] ? counts[year][month][day] : 0) : 0) : 0; 
        yVals.push(yVal);
      }
      setXValues(xVals);
      setYValues(yVals);
    }
  }
  
  const updateInterval = e => {
    const currentInterval = e.target.value;
    const currentSelection = isIntervalSelected;
    for(const interval in currentSelection) {
      currentSelection[interval] = false;
    }
    currentSelection[currentInterval]=true;
    setIsIntervalSelected(currentSelection);
    setInterval(currentInterval);
    updateChart(currentInterval);
  }

  return (
    <Card className={className}>
        <CardBody className="rounded-soft bg-gradient">
        <Row className="text-white align-items-center no-gutters">
          <Col>
              <h4 id="creation-count-heading" className="text-white mb-0">
                DSA Creation Timeline
              </h4>
          </Col>
          <Col xs="auto" className="d-none d-sm-block">
            <CustomInput
              type="select"
              id="creation-count-select"
              bsSize="sm"
              className="select-month mr-2"
              value={interval}
              onChange={updateInterval}
            >
              {isIterableArray(timeIntervals) &&
                timeIntervals.map((interval, index) =>  (
                  <option key={index} value={interval}>
                    {capitalize(interval)}
                  </option>
                ))}
            </CustomInput>
          </Col>
        </Row>
        <Row className="align-items-flex-end">
            <h6 id="creation-count-div" className="text-white fs--1 font-weight-semi-bold">
                      <span className="opacity-50"> Total  #</span>
                      {totalCount}
            </h6>
        </Row>
        <ReactEchartsCore echarts={echarts} option={getOption(xValues, yValues, isDark)} style={{maxHeight:'500px'}} />
        <Row className="d-sm-none d-md-none d-lg-none justify-content-center">
          {isIterableArray(timeIntervals) &&
            timeIntervals.map((interval, index) => (
              <Button
                key={index} 
                color={isIntervalSelected[interval] ? "falcon-primary mx-2" : "falcon-primary mx-2"}
                value={interval}
                style={isIntervalSelected[interval] ? {border:`solid 5px #0443A2`} : {}}
                className="creation-interval-select-btn"
                onClick={updateInterval}
              >
                {capitalize('1 '+interval.split(' ')[1].substring(0,1).toUpperCase())}
              </Button>
            ))}
        </Row>
      </CardBody>
    </Card>
  );
};

CreationTimeline.propTypes = {
  className: PropTypes.string
};

export default CreationTimeline;
