import { useQuery } from "@tanstack/react-query";
import { AppHeader, LoadingState, ReportCard, Screen } from "@/components/ui";
import { getReports } from "@/services/api";
import { useSavedStore } from "@/stores/saved-store";

export default function ReportsScreen() {
  const { data: reports = [], isLoading } = useQuery({ queryKey: ["reports"], queryFn: getReports });
  const saveItem = useSavedStore((state) => state.saveItem);
  return (
    <Screen>
      <AppHeader title="Reports" subtitle="Mock agricultural reports for crop, area, climate risk, and farm planning workflows." />
      {isLoading ? <LoadingState /> : reports.map((report) => (
        <ReportCard key={report.id} report={report} onSave={() => saveItem({ type: "Report", title: report.title, subtitle: report.description, payload: report })} />
      ))}
    </Screen>
  );
}

