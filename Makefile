devup:
	docker compose -f compose.dev.yml up --watch

devdown:
	docker compose -f compose.dev.yml down --volumes

clean: devdown

fclean: clean
	docker compose -f compose.dev.yml down --volumes --remove-orphans --rmi all

devre: fclean devup

cleandevre: prune devre

prune: fclean
	docker system prune -af --volumes

.PHONY: devup devdown clean fclean devre prune
