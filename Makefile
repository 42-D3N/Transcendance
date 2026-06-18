all:
	@echo "Docker compose is working..."
	@docker compose up
	@echo "Done."

fclean:
	@echo "Deleting everything..."
	@docker compose down && docker system prune -af
	@echo "Done."

re: fclean all