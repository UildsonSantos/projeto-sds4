import axios from 'axios';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { SaleSuccess } from 'types/sale';
import { round } from 'utils/format';
import { BASE_URL } from 'utils/requests';

type SeriesData = {
	name: string;
	data: number[];
}

type ChartData = {
	labels: {
		categories: string[];
	};
	series: SeriesData[];
}

const BarChart = () => {

	let [chartData, setChartData] = useState<ChartData>({
		labels: {
			categories: []
		},
		series: [
			{
				name: "",
				data: []                   
			}
		]
	});

	useEffect( () => {

		axios.get(`${BASE_URL}/sales/success-by-seller`)
			.then( response => {
				const data = response.data as SaleSuccess[];
				const myLabels = data.map( elem => elem.sellerName)
				const mySeries = data.map( elem => round(100.0 * elem.deals / elem.visited, 1));

				setChartData({ 
					labels: {
						categories: myLabels 
					},
					series: [
						{
							name: "% Success",
							data: mySeries
						}
					]
				});
			});

	}, [])

	const options = {
		plotOptions: {
			bar: {
				horizontal: true,
			}
		},
	};
    

    return (
			<Chart 
				options={{ ...options, xaxis: chartData.labels}}
				series={chartData.series}
				type="bar"
				height="240"     
			/>
    );
  }
  
  export default BarChart;
  