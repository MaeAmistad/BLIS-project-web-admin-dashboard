import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function CalendarPanel() {
  const calendarRef = useRef(null);
  const [title, setTitle] = useState("");
   const [events, setEvents] = useState([]);

 useEffect(() => {
    async function fetchAllAIEvents() {
      try {
        const raisersSnapshot = await getDocs(collection(db, "raisers"));

        const livestockPromises = raisersSnapshot.docs.map(raiserDoc =>
          getDocs(collection(db, "raisers", raiserDoc.id, "livestock")).then(
            livestockSnapshot => ({
              raiserId: raiserDoc.id,
              livestockDocs: livestockSnapshot.docs,
            })
          )
        );

        const allLivestock = await Promise.all(livestockPromises);

        const healthRecordPromises = allLivestock.flatMap(
          ({ raiserId, livestockDocs }) =>
            livestockDocs.map(livestockDoc =>
              getDocs(
                collection(
                  db,
                  "raisers",
                  raiserId,
                  "livestock",
                  livestockDoc.id,
                  "healthRecords"
                )
              ).then(healthRecordsSnapshot => ({
                raiserId,
                livestockId: livestockDoc.id,
                healthRecords: healthRecordsSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              }))
            )
        );

        const allHealthRecords = await Promise.all(healthRecordPromises);

        const aiEvents = allHealthRecords.flatMap(
          ({ raiserId, livestockId, healthRecords }) =>
            healthRecords
              .filter(record => record.type === "ai" && record.calvingDate)
              .map(record => ({
                id: `${raiserId}-${livestockId}-${record.id}`,
                title: "Reheat",
                start: record.calvingDate,
                allDay: true,
                backgroundColor: "#2941dc", 
                textColor: "white",
              }))
        );

        setEvents(aiEvents);
      } catch (error) {
        console.error("Error fetching AI events:", error);
      }
    }

    fetchAllAIEvents();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col p-3 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1 bg-gray-600 text-white rounded reounded-lg">
        <button
          onClick={() => calendarRef.current.getApi().prev()}
          className="p-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>

        <h2 className="text-sm font-medium text-white">
          {title}
        </h2>

        <button
          onClick={() => calendarRef.current.getApi().next()}
          className="p-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      {/* Calendar */}
      <div className="flex-1 min-h-0">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="100%"
          expandRows={true}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          dayHeaders={true}
          datesSet={(arg) => setTitle(arg.view.title)}
          events={events}
        />
      </div>
    </div>
  );
}
