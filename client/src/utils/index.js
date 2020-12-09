const options = { year: "numeric", month: "short", day: "numeric" };

const formatDate = date => new Date(date).toLocaleDateString("en-US", options);

// force focus on #main when using skip navigation link
// (some browsers will only focus form inputs, links, and buttons)
export const skip = targetId => {
  const removeTabIndex = e => {
    e.target.removeAttribute("tabindex");
  };
  const skipTo = document.getElementById(targetId);
  // Setting 'tabindex' to -1 takes an element out of normal
  // tab flow but allows it to be focused via javascript
  skipTo.tabIndex = -1;
  skipTo.focus(); // focus on the content container
  // console.log(document.activeElement);
  // when focus leaves this element,
  // remove the tabindex attribute
  skipTo.addEventListener("blur", removeTabIndex);
};

export const tradeInfo = (
  userProposed,
  toUser,
  fromUser,
  status,
  createdAt,
  updatedAt
) => {
  const proposer = userProposed ? "You" : fromUser.firstName;
  const receiver = userProposed ? toUser.firstName : "you";
  const receiverInitial = receiver === "you" ? "You" : receiver;
  const tradeInfoCreated = `${proposer} proposed this trade on ${formatDate(
    createdAt
  )}.`;
  const tradeInfoPending = `Now waiting for ${receiver} to approve or reject.`;
  const tradeInfoProcessed = `${receiverInitial} ${status} it on ${formatDate(
    updatedAt
  )}.`;
  const message =
    status === "pending"
      ? `${tradeInfoCreated} ${tradeInfoPending}`
      : `${tradeInfoCreated} ${tradeInfoProcessed}`;
  return message;
};
