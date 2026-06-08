TODO list :
- TOUT CONVERTIR EN TS DONC COMPILÉ DONC VM DONC METTRE EN PLACE LA VM
- Ajouter les effets de raquette (?)
- Corriger la prédiction de balle pour l'IA
- Ajuster et tester encore et encore les 4 IAs (E/M/H/I)
- Ajouter une séléction d'IA
- Ajouter une séléction de mode de jeu (IA vs IA | 1 vs 1 | 1 vs IA | 1 vs 1 vs 1 vs 1)
- Ajouter une killcam (pong) en MLG
- Lors de la défaite, animation de mort (explosion de la raquette style Undertale)

Power ups :
- Agrandir (smirk) la raquette



<!-- su -
- apt update
- apt upgrade
- apt install sudo
- adduser <username> sudo
- reboot

sudo apt install zsh
chsh <username>
==> /bin/zsh
CTRL+D
q
sudo apt install vim
<edit zshrc>
> Network -> advanced -> port-forwarding -> new : Host 9191 guest 22
> SharedFolder -> path (host path) -> folder name : shared -> Make permanent
vim .zshrc : `s-mount='sudo mount -t vboxsf -o uid=1000,gid=1000 shared /home/<username>/shared'`
sudo apt install npm
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -->
