const mongoose = require('mongoose');
(async () => {
		try {
				await mongoose.connect(
					"mongodb+srv://admin:admin@cluster0.qhmzz.mongodb.net/linkAPI?retryWrites=true&w=majority",
					{
						useNewUrlParser: true,
						useFindAndModify: true,
						useUnifiedTopology: true,
						useCreateIndex: true,
					}
				);
				console.log("MongoDB Connected: ");
		} catch (error) {
			console.log('MongoDB ERROR: ' + error)
		}
})();
