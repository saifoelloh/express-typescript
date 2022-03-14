import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import CategoriesRoute from './routes/categories.route';
import ChaptersRoute from './routes/chapters.route';
import ChoicesRoute from './routes/choice.route';
import CoursesRoute from './routes/courses.route';
import QuizzesRoute from './routes/quizzes.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new CategoriesRoute(),
  new CoursesRoute(),
  new ChaptersRoute(),
  new QuizzesRoute(),
  new ChoicesRoute(),
]);

app.listen();
