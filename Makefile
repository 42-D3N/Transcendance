devup:
	docker compose -f compose.dev.yml up --watch

devdown:
	docker compose -f compose.dev.yml down --volumes

clean: devdown

fclean: clean
	docker compose -f compose.dev.yml down --volumes --remove-orphans --rmi all

devre: fclean devup

prune: fclean
	docker system prune -af --volumes

devgrrrrrr: devre

.PHONY: devup devdown clean fclean devre prune devgrrrrrr