import getGDReportByGDIdApi from "@/services/GDReport/getDGReportByGDIdApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function GDDetails(){
    const { dairyId } = useParams();

    const { data: gdReportData, isLoading, error } = useQuery({
        queryKey: ["gdReportDetails", dairyId],
        queryFn: () => getGDReportByGDIdApi(dairyId),
        enabled: !!dairyId,
    })

    const gdReportDetails = gdReportData?.data || null;

    console.log("GD Report Details for Dairy ID ", dairyId, ": ", gdReportDetails);
    return(
        <div>
            GD Details Page
        </div>
    )
}

export default GDDetails;