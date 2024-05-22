import React, {useEffect, useState} from "react"
import DOMPurify from 'dompurify';
import styles from "../../styles/Post.module.css"
import {Badge, Card, Col, Container, Image, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import {axiosReq, axiosRes} from "../../api/axiosDefaults";
import ConfirmationModal from "../../components/ConfirmationModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import Asset from "../../components/Asset";
import {fetchMoreData} from "../../utils/utils";

const Dog = (props) => {
    const {
        id,
        owner,
        is_owner,
        owner_name,
        birthday,
        age,
        breed,
        characteristics,
        gender,
        is_adopted,
        name,
        size,
        description,
        main_image,
        created_at,
        updated_at,
        dogPage,
        setDogs,
        profile_id,
        owner_phone,
        owner_address,
    } = props;

    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const [dogPosts, setDogPosts] = useState({ results: [] });

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const [{ data: dogPosts }] = await Promise.all([
                        axiosReq.get(`/posts/?dogs__id=${id}`),
                    ]);
                    setDogPosts(dogPosts);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (main_image && main_image.url) {
            setImageUrl(main_image.url);
        }
    }, [main_image]);

    // Sanitize HTML content to prevent security issues
    const sanitizedDescription = React.useMemo(() => {
        return { __html: DOMPurify.sanitize(description) };
    }, [description]);

    const handleEdit = () => {
        navigate(`/dogs/${id}/edit`);
    };

    const handleDelete = async () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosRes.delete(`/dogs/${id}/`);
            navigate(-1);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between flex-wrap">
                <div>
                    {is_adopted ? (
                        <Badge pill bg="success">
                            Found a home
                        </Badge>
                    ) : (
                        <Badge pill bg="danger">
                            Looking for a home
                        </Badge>
                    )}
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span>{updated_at}</span>
                    {is_owner && dogPage && (
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Card.Body>
            <Link to={`/dogs/${id}`}>
                <div className={styles.SquareContainer}>
                    <Image className={styles.SquareImage} src={imageUrl} width="100%" alt={name} />
                </div>
            </Link>
            <Card.Body>
                {name && <h2 className="text-center">{name}</h2>}
                {sanitizedDescription && !dogPage && <Card.Text
                    className={styles.Truncate}
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {sanitizedDescription && dogPage && <Card.Text
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {!dogPage && <Card.Link href={`/dogs/${id}`}>View dog</Card.Link>}
                {dogPage &&
                    <Container className={styles.DogDetails}>
                        <Row>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-dog ${styles.Icon}`}/> {breed}
                            </Col>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-weight-scale ${styles.Icon}`}/> {size}
                            </Col>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-venus-mars ${styles.Icon}`}/> {gender}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="py-2 p-0 p-lg-2">
                                <i className={`fa-solid fa-cake-candles ${styles.Icon}`}/> {birthday} ({age})
                            </Col>
                        </Row>
                        {characteristics && characteristics.length > 0 &&
                            <div className="mt-4 mb-5 d-flex gap-3">
                                {characteristics.map((char, index) => (
                                    <div className={styles.Characteristic} key={index}>{char.characteristic}</div>
                                ))}
                            </div>
                        }
                        <hr/>
                        <div className="mb-5 mt-4">
                            {owner &&
                                <Link to={`/profiles/${profile_id}`}>
                                    <h3 className="text-center">{owner_name}</h3>
                                </Link>
                            }
                            <Row>
                                {owner_phone &&
                                    <Col className="py-2 p-0 p-lg-2">
                                        <i className={`fa-solid fa-phone ${styles.Icon} ${styles.BlueIcon}`}/> {owner_phone}
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {owner_address &&
                                    <Col className="py-2 p-0 p-lg-2">
                                        <i className={`fa-solid fa-location-dot ${styles.Icon} ${styles.BlueIcon}`}/> {owner_address}
                                    </Col>
                                }
                            </Row>
                        </div>
                        {dogPosts.results && dogPosts.results.length > 0 && (
                            <>
                                <hr/>
                                <div className="mb-5 mt-4">
                                    <h3 className="text-center">Posts linked to {name}</h3>
                                    <InfiniteScroll
                                        children={dogPosts.results.map((post) => (
                                            <Post key={post.id} {...post} setPosts={setDogPosts} />
                                        ))}
                                        dataLength={dogPosts.results.length}
                                        loader={<Asset spinner />}
                                        hasMore={!!dogPosts.next}
                                        next={() => fetchMoreData(dogPosts, setDogPosts)}
                                    />
                                </div>
                            </>
                        )}
                    </Container>
                }
            </Card.Body>
            <ConfirmationModal title="Confirm deletion" text="Are you sure you want to delete this dog?"
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                onConfirm={handleConfirmDelete}
            />
        </Card>
    )
}

export default Dog