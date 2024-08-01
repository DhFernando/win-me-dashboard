import "../assets/css/datetime.css";
import DateTimeDisplay from "./DateTimeDisplay";
import useCountDown from "../hooks/useCountDown";
import { CountDownMessage } from "types/enums";

const ExpiredNotice = ({ message }: {
  message: CountDownMessage;
}) => {
  return (
    <div className="expired-notice">
      <span>{message}</span>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
      <a
        href="https://tapasadhikary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="countdown-link"
      >
        {/* <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} /> */}
        {/* <p>:</p> */}
        <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
      </a>
    </div>
  );
};

const CountDownTimer = ({ targetDate, message }: {
  targetDate: any;
  message: CountDownMessage;
}) => {
  const [days, hours, minutes, seconds] = useCountDown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice message={message} />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountDownTimer;
