import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {AdminChartPie} from "../../../data/AdminChartData.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartForAdmin = () => {
  return (
    <div  style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      width: "400px", 
      height: "400px",
      margin: "0 auto"
    }}>
      <Pie data={AdminChartPie} />
    </div>
  );
};

export default PieChartForAdmin;
