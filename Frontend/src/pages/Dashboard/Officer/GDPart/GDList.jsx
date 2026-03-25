import getGDReportByThanaApi from "@/services/GDReport/getGDReportByThanaApi";
import userStore from "@/state/userStore";
import { useQuery } from "@tanstack/react-query";

function GDList(){
    const { user } = userStore();
    const thana_id = user?.thana_id;
    // console.log("Thana ID from userStore: ", thana_id);

    const { data: gdReportsData, isLoading, error } = useQuery({
        queryKey: ["gdReportsByThana", thana_id],
        queryFn: () => getGDReportByThanaApi(thana_id),
        enabled: !!thana_id,
    })

    const gdReports = gdReportsData?.data || [];

    console.log("GD Reports for Thana ID ", thana_id, ": ", gdReports);
    return (
        <div>
            <h1>GD List</h1>
            {/* Add your GD list components and content here */}
        </div>
    )
}

export default GDList;