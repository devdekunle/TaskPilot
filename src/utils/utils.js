import { format } from "date-fns";

const formatDate = (dateString, formatString) => {
  const parsedDate = new Date(dateString);
  return format(parsedDate, formatString);
};

export default formatDate;