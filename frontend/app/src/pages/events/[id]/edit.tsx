import { useRouter } from "next/router";
import EventForm from "components/events/Form"

const EventsEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <EventForm event_id={id as string} />
  );
}

export default EventsEditPage;