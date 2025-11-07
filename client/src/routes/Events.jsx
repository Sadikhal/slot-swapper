import useEventData from "../hooks/useEventData";
import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";
import { cn, formatDateTime } from "../lib/utils";

const Events = () => {
  const {
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createEvent,
    updateEvent,
    handleDelete,
    sortOrder
  } = useEventData();

  const columns = [
    {
      header: "Event Title",
      accessor: "title",
      className: "px-2"
    },
    {
      header: "Description",
      accessor: "desc",
      className: "table-cell"
    },
    {
      header: "Starting Time",
      accessor: "time",
      className: "px-2"
    },
    {
      header: "Ending Time",
      accessor: "time",
      className: "px-2"
    },
     {
      header: "Event Phase",
      accessor: "eventPhase",
      className: "px-2"
    },
    {
      header: "Status",
      accessor: "status",
      className: "px-2"
    },
    {
      header: "Actions",
      accessor: "action",
      className: "px-2"
    }
  ];

  const renderRow = (item) => {
    const currentDate = new Date();
    const startDate = new Date(item?.startingTime);
    const endDate = new Date(item?.endingTime);


    let eventPhase = "Upcoming";
    if (currentDate > endDate) {
      eventPhase = "Completed";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      eventPhase = "Ongoing";
    }

    return (
      <tr
        key={item?._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight items-center font-normal"
      >
        <td className="table-cell px-2 py-5 capitalize min-w-40 ">{item?.title}</td>
        <td className="table-cell px-2 min-w-40">{item?.desc}</td>
        <td className="px-3 text-nowrap">
          {formatDateTime(item?.startingTime)}
        </td>
         <td className="px-3 text-nowrap">
         {formatDateTime(item?.endingTime)}
        </td>
        <td className="px-3">
          <span className={cn("px-1 py-1 items-center w-full flex justify-center text-lamaWhite text-[10px] rounded-2xl capitalize", item.status === "BUSY" ? "bg-lamaSky" : item.status === "SWAPPABLE" ?  "bg-lightGreen" : "bg-lamaTeal")}>
            {item?.status}
          </span>
          </td>
        <td className="px-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            eventPhase === "Completed" ? "bg-inputGreen text-warning" :
            eventPhase === "Ongoing" ? "bg-inputGreen text-lamaSky" :
            "bg-inputGreen text-lightGreen"
          }`}>
            {eventPhase}
          </span>
        </td>
        
          <td className="text-nowrap flex flex-row items-center gap-2 py-4 mx-4">     
            <FormModal 
              onSuccess={(data) => updateEvent(item?._id, data)}
              table="eventForm" 
              type="update" 
              data={item} 
            />
            <FormModal 
              table="eventForm"  
              handleDelete={() => handleDelete(item?._id)} 
              type="delete" 
              id={item?._id} 
            />
          </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 w-full h-full ">
      <div className="flex items-center justify-between">
        <h1 className="block text-base text-nowrap md:text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch 
            onSearch={handleSearch}
            placeholder="Search events..." 
          />
          <div className="flex items-center gap-4 self-end pr-2">
            <button 
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow shadow-lg border-slate-100 border cursor-pointer hover:bg-lightBlue"
              aria-label={`Sort ${sortOrder === "newest" ? "oldest first" : "newest first"}`}
            >
              <img 
                src="/images/sort.png" 
                alt="Sort" 
                className="w-4 h-4"
              />
            </button>
              <FormModal table="eventForm" type="create" onSuccess={createEvent} />
          </div>
        </div>
      </div>
      
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredData} 
        loading={loading}
        error={error} 
      />
    </div>
  );
};

export default Events;