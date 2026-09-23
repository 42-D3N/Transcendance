up:
	docker compose -f compose.yml up --build

down:
	docker compose -f compose.yml down

devup:
	docker compose -f compose.dev.yml up --watch

devdown:
	docker compose -f compose.dev.yml down

clean:
	docker compose -f compose.yml down --volumes

devclean:
	docker compose -f compose.dev.yml down --volumes

fclean: clean
	docker compose -f compose.yml down --volumes --remove-orphans --rmi all

devfclean: devclean
	docker compose -f compose.dev.yml down --volumes --remove-orphans --rmi all

re: fclean up

devre: fclean devup

prunere: prune re

prunedevre: prune devre

prune: fclean devfclean
	docker system prune -af --volumes
	docker builder prune -af

.PHONY: devup devdown clean fclean devre prune
