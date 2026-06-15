devup:
	docker compose up -f compose.dev.yml -d --watch

devdown:
	docker compose down -f compose.dev.yml --volumes

clean: devdown

fclean: clean
	docker compose down --volumes --remove-orphans --rmi all

devre: fclean devup

prune: fclean
	docker system prune -af --volumes

.PHONY: devup devdown clean fclean devre prune