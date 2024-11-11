import React, { useState, useEffect } from 'react';
import { Search, Book, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button.jsx';
import { Alert, AlertDescription } from './Alert.jsx';

const API_KEY = process.env.REACT_APP_API_KEY;
const AMAZON_TAG = process.env.REACT_APP_AMAZON_TAG;
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const RESULTS_PER_PAGE = 20;

const INITIAL_CATEGORIES = [
	{ id: 'fiction', label: 'Ficción' },
	{ id: 'science', label: 'Ciencia' },
	{ id: 'history', label: 'Historia' },
	{ id: 'technology', label: 'Tecnología' },
];

const BookFinderApp = () => {
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [language, setLanguage] = useState('es');
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [categories, setCategories] = useState(INITIAL_CATEGORIES);
	const [startIndex, setStartIndex] = useState(0);
	const [hasMore, setHasMore] = useState(false); // Inicialmente en false para evitar búsqueda al cargar

	useEffect(() => {
		const fetchCategories = async () => {
			const discoveredCategories = await discoverCategories();
			if (discoveredCategories) {
				setCategories(discoveredCategories.map((cat, index) => ({ id: `cat${index}`, label: cat.name })));
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.innerHeight + window.scrollY;
			const pageHeight = document.documentElement.offsetHeight;
			// Detectar si estamos cerca del final de la página para activar el scroll infinito
			if (scrollPosition >= pageHeight - 100 && hasMore && !loading) {
				loadMoreBooks();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [loading, hasMore]);

	const handleCategoryToggle = (categoryId) => {
		setSelectedCategories(prev => {
			if (prev.includes(categoryId)) {
				return prev.filter(id => id !== categoryId);
			} else {
				return [...prev, categoryId];
			}
		});
	};

	const loadMoreBooks = async () => {
		setLoading(true);

		try {
			const searchQuery = selectedCategories.length
				? selectedCategories.map(cat => categories.find(c => c.id === cat).label).join(' OR ')
				: 'books'; // Si no hay categorías, busca "books" para obtener más resultados

			const params = new URLSearchParams({
				q: searchQuery,
				printType: 'books',
				orderBy: 'newest',
				maxResults: 40, // Aumentar al valor máximo permitido
				startIndex: startIndex,
				key: API_KEY,
				langRestrict: language
			});

			const response = await fetch(`${BASE_URL}?${params}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error('Error al obtener los libros');
			}

			const uniqueBooks = [];
			const seenBookIds = new Set(books.map(book => book.id));

			(data.items || []).forEach(book => {
				if (!seenBookIds.has(book.id) && book.volumeInfo.language === language) {
					seenBookIds.add(book.id);
					uniqueBooks.push(book);
				}
			});

			setBooks(prevBooks => [...prevBooks, ...uniqueBooks]);
			setStartIndex(prevIndex => prevIndex + 40); // Incrementar por el máximo

			if (uniqueBooks.length < 40) { // Si menos de 40 libros, se agotaron los resultados
				setHasMore(false);
			} else {
				setHasMore(true);
			}
		} catch (err) {
			setError('Error al cargar más libros. Por favor, intenta de nuevo.');
		} finally {
			setLoading(false);
		}
	};

	const searchBooks = () => {
		setStartIndex(0); // Reinicia el índice de paginación
		setBooks([]); // Limpia los libros actuales
		setHasMore(true); // Resetea el flag para scroll infinito
		loadMoreBooks(); // Carga la primera página de resultados
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">Buscador de Libros</h1>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Categorías de interés
							</label>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
								{categories.map((category) => (
									<Button
										key={category.id}
										variant={selectedCategories.includes(category.id) ? "default" : "outline"}
										onClick={() => handleCategoryToggle(category.id)}
										className="justify-start"
									>
										{category.label}
									</Button>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Idioma
							</label>
							<select
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
								className="w-full rounded-md border border-gray-300 p-2"
							>
								<option value="es">Español</option>
								<option value="en">English</option>
								<option value="fr">Français</option>
								<option value="de">Deutsch</option>
							</select>
						</div>

						<Button
							onClick={searchBooks}
							disabled={loading}
							className="w-full"
						>
							{loading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Search className="mr-2 h-4 w-4" />
							)}
							Buscar Libros
						</Button>
					</div>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-6 md:grid-cols-2">
					{books.map((book) => {
						const title = encodeURIComponent(book.volumeInfo.title);
						const author = encodeURIComponent(book.volumeInfo.authors?.[0] || "");
						const amazonLink = `https://www.amazon.com/s?k=${title}+${author}&tag=${AMAZON_TAG}`;

						return (
							<Card key={book.id} className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle className="text-xl">{book.volumeInfo.title}</CardTitle>
									<CardDescription>
										{book.volumeInfo.authors?.join(', ') || 'Autor desconocido'}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 line-clamp-3">
										{book.volumeInfo.description || 'Sin descripción disponible'}
									</p>
								</CardContent>
								<CardFooter className="flex gap-4">
									{book.volumeInfo.imageLinks?.thumbnail && (
										<img
											src={book.volumeInfo.imageLinks.thumbnail}
											alt={book.volumeInfo.title}
											className="w-24 h-auto object-cover rounded"
										/>
									)}
									<Button
										variant="outline"
										onClick={() => window.open(amazonLink, '_blank')}
									>
										Ver más
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				{loading && (
					<div className="flex justify-center my-6">
						<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
					</div>
				)}
			</div>
		</div>
	);
};

export default BookFinderApp;

const discoverCategories = async () => {
	const generalKeyword = "libros";
	const params = new URLSearchParams({
		q: generalKeyword,
		printType: 'books',
		orderBy: 'relevance',
		maxResults: '40',
		key: API_KEY
	});

	try {
		const response = await fetch(`${BASE_URL}?${params}`);
		const data = await response.json();

		if (!response.ok) {
			throw new Error('Error al obtener los libros');
		}

		const categoryCounts = {};

		(data.items || []).forEach(book => {
			const categories = book.volumeInfo.categories;
			if (categories) {
				categories.forEach(category => {
					categoryCounts[category] = (categoryCounts[category] || 0) + 1;
				});
			}
		});

		const sortedCategories = Object.entries(categoryCounts)
			.sort((a, b) => b[1] - a[1])
			.map(entry => ({ name: entry[0], count: entry[1] }));

		return sortedCategories;
	} catch (error) {
		console.error("Error al descubrir categorías:", error);
	}
};
