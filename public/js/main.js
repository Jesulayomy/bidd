const socket = io();
const bidH = document.querySelector('button.hundred');
const bidT = document.querySelector('button.thousand');
let price = 100;


bidH.addEventListener('click', () => newBid(100, false));
bidT.addEventListener('click', () => newBid(1000, true));


function newBid(amount, premium) {
  const bid = parseFloat(document.querySelector('.quote').innerText);
  const pathParts = window.location.pathname.split('/').filter(part => part !== '');
  const itemID = pathParts[pathParts.length - 1];
  // socket.emit('bid', {name: userName, bid: bid + amount, itemID, premium});
  fetch('/bid', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'bid': bid + amount,
      '_id': itemID,
      'premium': premium
    })
  })
}

socket.on('bid', (item) => {
  const pathParts = window.location.pathname.split('/').filter(part => part !== '');
  const itemID = pathParts[pathParts.length - 1];
  if (itemID === item._id) {
    document.querySelector('.quote').innerText = item.highestBid;
    document.querySelector('.high').innerText = `Highest Bidder: ${item.highestBidder.name}`;
    let li = document.createElement('li');
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
    li.innerHTML = `
      <div class="ms-2 me-auto">
        <div class="fw-bold">${item.bids[0].user.name}</div>
        ${ item.bids[0].premium ? `<span class="text-success">Premium bid for ${item.name}</span>`: `Basic bid for ${item.name}`}
      </div>
      <span class="badge text-bg-primary rounded-pill bid">$${item.bids[0].bid}</span>
    `
    document.querySelector('div.bids').prepend(li);
  }
});
