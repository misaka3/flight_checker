import { useRouter } from "next/router";
import EventForm from "components/pages/EventForm"

const EventsEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <EventForm event_id={id as string} />
  );
}

export default EventsEditPage;