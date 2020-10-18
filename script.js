const playerList = document.getElementById("charactersList");
const searchBar = document.getElementById("searchBar");
const count = document.getElementById("count");

let hpCharacters = [];

searchBar.addEventListener("keyup", (e) => {
  const serachString = e.target.value.toLowerCase();

  filteredCharacters = hpcharacters.filter((character) => {
    return (
      character.PFName.toLowerCase().includes(serachString) ||
      character.SkillDesc.toLowerCase().includes(serachString)
    );
  });

  filteredCharacters.length < 1
    ? (count.innerHTML = "No Players Found")
    : (count.innerHTML = "");
  displayCharacters(filteredCharacters);
});

const loadCharacters = async () => {
  try {
    const res = await fetch(
      "https://api.jsonbin.io/b/5d0c6e6a860ae0341876aac6/2"
    );
    hpcharacters = await res.json();
    const valueFilter = hpcharacters.sort((a, b) => {
      return a.Value - b.Value;
    });
	formatDate(valueFilter);
    displayCharacters(valueFilter);
  } catch (err) {
    console.log(err);
  }
};


formatDate = (data) => {
	for(i=0;i<data.length;i++){
		data[i].UpComingMatchesList[0].MDate = new Date(data[i].UpComingMatchesList[0].MDate)
		data[i].UpComingMatchesList[0].date = data[i].UpComingMatchesList[0].MDate.getDate().toString().padStart(2, '0')
		data[i].UpComingMatchesList[0].month = (data[i].UpComingMatchesList[0].MDate.getMonth()+1).toString().padStart(2, '0')
		data[i].UpComingMatchesList[0].year = data[i].UpComingMatchesList[0].MDate.getFullYear().toString().padStart(4, '0')
		data[i].UpComingMatchesList[0].hours = data[i].UpComingMatchesList[0].MDate.getHours().toString().padStart(2, '0')
		data[i].UpComingMatchesList[0].hours = data[i].UpComingMatchesList[0].hours === '00' ? '12' : data[i].UpComingMatchesList[0].hours
		data[i].UpComingMatchesList[0].minutes =data[i].UpComingMatchesList[0].MDate.getMinutes().toString().padStart(2, '0')
		data[i].UpComingMatchesList[0].seconds =  data[i].UpComingMatchesList[0].MDate.getSeconds().toString().padStart(2, '0')
		data[i].UpComingMatchesList[0].timezone = data[i].hours >= 12 ? 'PM' : 'AM';
		data[i].UpComingMatchesList[0].MDate = `${data[i].UpComingMatchesList[0].date}-${data[i].UpComingMatchesList[0].month}-${data[i].UpComingMatchesList[0].year} ${data[i].UpComingMatchesList[0].hours}:${data[i].UpComingMatchesList[0].minutes}:${data[i].UpComingMatchesList[0].seconds} ${data[i].UpComingMatchesList[0].timezone}`
	}
};

const displayCharacters = (characters) => {
  const htmlString = characters
    .map((character) => {
      return `
		<li class="character">
		<img src='./player-images/${character.Id}.jpg' />
		<h3>${character.PFName}</h3>
		<p class="player-position">(<span class="semi-bold">${
      character.SkillDesc
    }</span>)</p>
		<p class="player-value center">Players Value : <span class="semi-bold">$${
      character.Value
    }</span></p>
		<p class="player-value center">Upcoming Match : <span class="semi-bold">
		${
      character.UpComingMatchesList[0].TID != 0
        ? `${character.UpComingMatchesList[0].CCode} VS ${character.UpComingMatchesList[0].VsCCode}`
        : "Not Playing Today"
    }
		</span></p>
		<p class="player-value center">Match Time : <span class="semi-bold">
		${
      character.UpComingMatchesList[0].TID != 0
        ? `${character.UpComingMatchesList[0].MDate}`
        : "Not Available"
    }
		</span></p>
		</li>
		`;
    })
    .join("");

  playerList.innerHTML = htmlString;
};

loadCharacters();
